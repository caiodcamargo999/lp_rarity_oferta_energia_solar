const { google } = require('googleapis');
const readline = require('readline');

// Configuração OAuth2
const oauth2Client = new google.auth.OAuth2(
  '384658893111-9a9ff4ik2173sl7jp53f85m4ia26vt50.apps.googleusercontent.com', // Client ID
  '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', // Client Secret
  'http://localhost:3000' // Redirect URI
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
console.log('\n📋 INSTRUÇÕES:');
console.log('1. Copie a URL acima e cole no navegador');
console.log('2. Faça login com matheusdrarity@gmail.com');
console.log('3. Autorize todas as permissões');
console.log('4. Copie o código de autorização da URL de redirecionamento');
console.log('5. Cole o código aqui quando solicitado\n');

// Interface para ler o código de autorização
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
  } finally {
    rl.close();
  }
});
