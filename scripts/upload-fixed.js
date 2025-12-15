const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Configurações do Cloudflare R2
const R2_CONFIG = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    region: 'us-east-1', // R2 compatibility region
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
};

// Mapeamento de tipos de vídeo
const VIDEO_TYPES = {
    googleads: 'video-google-ads.mp4',
    landingpages: 'video-landing-pages.mp4',
    default: 'video-de-vendas.mp4'
};

const MULTIPART_CONFIG = {
    chunkSize: 50 * 1024 * 1024,
    maxRetries: 3,
    retryDelay: 2000
};

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${type}] [${timestamp}] ${message}`);
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = crypto.createHmac('sha256', "AWS4" + key).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
    const kSigning = crypto.createHmac('sha256', kService).update("aws4_request").digest();
    return kSigning;
}

function createSignature(method, fullUri, headers, body = '') {
    const [path, query] = fullUri.split('?');

    let canonicalQueryString = '';
    if (query) {
        const params = new URLSearchParams(query);
        params.sort();
        canonicalQueryString = params.toString().replace(/\+/g, '%20');
    }

    const canonicalRequest = [
        method,
        path,
        canonicalQueryString,
        Object.keys(headers).sort().map(key => `${key.toLowerCase()}:${headers[key]}`).join('\n'),
        '',
        Object.keys(headers).sort().map(key => key.toLowerCase()).join(';'),
        crypto.createHash('sha256').update(body).digest('hex')
    ].join('\n');

    const dateStamp = headers['X-Amz-Date'].split('T')[0];
    const region = 'us-east-1';
    const service = 's3';

    const stringToSign = [
        'AWS4-HMAC-SHA256',
        headers['X-Amz-Date'],
        `${dateStamp}/${region}/${service}/aws4_request`,
        crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signingKey = getSignatureKey(R2_CONFIG.secretAccessKey, dateStamp, region, service);

    const signature = crypto
        .createHmac('sha256', signingKey)
        .update(stringToSign)
        .digest('hex');

    return signature;
}

function createHeaders(method, uri, body, contentType = 'video/mp4') {
    const now = new Date();
    const date = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');

    const headers = {
        'Host': `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
        'X-Amz-Date': date,
        'X-Amz-Content-Sha256': crypto.createHash('sha256').update(body).digest('hex'),
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(body).toString()
    };

    const signature = createSignature(method, uri, headers, body);
    headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${R2_CONFIG.accessKeyId}/${date.split('T')[0]}/us-east-1/s3/aws4_request, SignedHeaders=${Object.keys(headers).sort().map(k => k.toLowerCase()).join(';')}, Signature=${signature}`;

    return headers;
}

function makeRequest(options, body = '') {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function uploadSimpleVideo(filePath, fileName) {
    const fileContent = fs.readFileSync(filePath);
    const uri = `/${R2_CONFIG.bucketName}/${fileName}`;
    const headers = createHeaders('PUT', uri, fileContent);
    const options = {
        hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
        path: uri,
        method: 'PUT',
        headers: headers
    };
    const response = await makeRequest(options, fileContent);
    if (response.statusCode !== 200) throw new Error(`Upload Falhou: ${response.statusCode} - ${response.body}`);
    return { url: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileName}` };
}

async function initiateMultipartUpload(fileName) {
    const uri = `/${R2_CONFIG.bucketName}/${fileName}?uploads`;
    const headers = createHeaders('POST', uri, '', 'video/mp4');
    const response = await makeRequest({
        hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
        path: uri,
        method: 'POST',
        headers: headers
    });
    if (response.statusCode !== 200) throw new Error(`Init Multipart Failed: ${response.statusCode} ${response.body}`);
    const match = response.body.match(/<UploadId>([^<]+)<\/UploadId>/);
    if (!match) throw new Error('No UploadId');
    return match[1];
}

async function uploadPart(fileName, uploadId, partNumber, chunk) {
    const uri = `/${R2_CONFIG.bucketName}/${fileName}?partNumber=${partNumber}&uploadId=${uploadId}`;
    const headers = createHeaders('PUT', uri, chunk, 'video/mp4');
    const response = await makeRequest({
        hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
        path: uri,
        method: 'PUT',
        headers: headers
    }, chunk);
    if (response.statusCode !== 200) throw new Error(`Part ${partNumber} Failed: ${response.statusCode}`);
    return { partNumber, etag: response.headers.etag };
}

async function completeMultipartUpload(fileName, uploadId, parts) {
    const partsXml = parts.map(p => `<Part><PartNumber>${p.partNumber}</PartNumber><ETag>${p.etag}</ETag></Part>`).join('');
    const body = `<CompleteMultipartUpload>${partsXml}</CompleteMultipartUpload>`;
    const uri = `/${R2_CONFIG.bucketName}/${fileName}?uploadId=${uploadId}`;
    const headers = createHeaders('POST', uri, body, 'application/xml');
    const response = await makeRequest({
        hostname: `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
        path: uri,
        method: 'POST',
        headers: headers
    }, body);
    if (response.statusCode !== 200) throw new Error(`Complete Failed: ${response.statusCode} ${response.body}`);
}

async function main() {
    const [filePath, type] = process.argv.slice(2);
    if (!filePath || !type) {
        console.log('Use: node script.js <file> <type>');
        process.exit(1);
    }
    const fileName = VIDEO_TYPES[type] || 'video-de-vendas.mp4';
    const size = fs.statSync(filePath).size;
    log(`Starting upload: ${filePath} -> ${fileName} (${size} bytes)`);

    if (size < MULTIPART_CONFIG.chunkSize) {
        const res = await uploadSimpleVideo(filePath, fileName);
        log(`Success! URL: ${res.url}`);
    } else {
        const uploadId = await initiateMultipartUpload(fileName);
        log(`UploadId: ${uploadId}`);
        const parts = [];
        const buffer = fs.readFileSync(filePath); // For simplicity provided 1GB memory? Mmm, stream is better.
        // But for <2GB node usually handles buffer?
        // Let's use stream to be safe as original script.
        // Re-implementing stream logic is verbose.
        // I will use fs.readFileSync for now if user has enough RAM. 
        // 1GB might crash.
        // I'll assume I can read it. Or I should implement stream reading.
        // Given I am writing this from scratch, let's implement the looping buffer upload.

        let sent = 0;
        let partNum = 1;
        const fd = fs.openSync(filePath, 'r');
        while (sent < size) {
            const end = Math.min(sent + MULTIPART_CONFIG.chunkSize, size);
            const chunkLen = end - sent;
            const chunk = Buffer.alloc(chunkLen);
            fs.readSync(fd, chunk, 0, chunkLen, sent);
            const part = await uploadPart(fileName, uploadId, partNum, chunk);
            parts.push(part);
            log(`Part ${partNum} uploaded`);
            partNum++;
            sent += chunkLen;
        }
        await completeMultipartUpload(fileName, uploadId, parts);
        log(`Success! URL: https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com/${R2_CONFIG.bucketName}/${fileName}`);
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
