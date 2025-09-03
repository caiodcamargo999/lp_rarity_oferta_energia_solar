const { google } = require('googleapis');

// Configuração OAuth2 mais simples
const oauth2Client = new google.auth.OAuth2(
  '384658893111-9a9ff4ik2173sl7jp53f85m4ia26vt50.apps.googleusercontent.com',
  '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',
  'urn:ietf:wg:oauth:2.0:oob' // URI especial para aplicações desktop
);

// Escopos necessários
const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/spreadsheets'
];

// Gerar URL de autorização
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('🔗 URL de Autorização:');
console.log(authUrl);
console.log('\n📋 INSTRUÇÕES ALTERNATIVAS:');
console.log('1. Copie a URL acima e cole no navegador');
console.log('2. Faça login com matheusdrarity@gmail.com');
console.log('3. Autorize todas as permissões');
console.log('4. Você será redirecionado para uma página com o código');
console.log('5. Copie o código e cole aqui\n');

// Interface para ler o código
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('📝 Cole o código de autorização aqui: ', async (code) => {
  try {
    // Trocar código por tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n🎉 REFRESH TOKEN GERADO COM SUCESSO!');
    console.log('📋 Adicione isto ao seu .env.local:');
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    
    console.log('\n🔑 Detalhes dos tokens:');
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Access Token:', tokens.access_token);
    console.log('Expires In:', tokens.expiry_date);
    
  } catch (error) {
    console.error('❌ Erro ao gerar refresh token:', error.message);
    console.log('\n🔧 SOLUÇÃO ALTERNATIVA:');
    console.log('1. Vá para: https://script.google.com/');
    console.log('2. Faça login com matheusdrarity@gmail.com');
    console.log('3. Crie um novo projeto');
    console.log('4. Cole este código e execute:');
    console.log(`
function getRefreshToken() {
  const clientId = '384658893111-9a9ff4ik2173sl7jp53f85m4ia26vt50.apps.googleusercontent.com';
  const clientSecret = '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';
  
  const url = 'https://accounts.google.com/o/oauth2/auth?' +
    'client_id=' + clientId +
    '&redirect_uri=urn:ietf:wg:oauth:2.0:oob' +
    '&scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/spreadsheets' +
    '&response_type=code' +
    '&access_type=offline' +
    '&prompt=consent';
    
  Logger.log('URL de autorização: ' + url);
  Logger.log('1. Cole esta URL no navegador');
  Logger.log('2. Faça login e autorize');
  Logger.log('3. Cole o código aqui quando solicitado');
}
    `);
  } finally {
    rl.close();
  }
});
