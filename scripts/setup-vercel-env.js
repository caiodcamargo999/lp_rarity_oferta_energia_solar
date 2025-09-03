#!/usr/bin/env node

/**
 * Script para configurar variáveis de ambiente no Vercel
 * Execute: node scripts/setup-vercel-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando variáveis de ambiente para o Vercel...\n');

// Verificar se o arquivo de Service Account existe
const serviceAccountPath = path.join(process.cwd(), 'lp-rarity-oferta-energia-solar-d04cccf3789c.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Arquivo de Service Account não encontrado!');
  console.error('   Certifique-se de que o arquivo lp-rarity-oferta-energia-solar-d04cccf3789c.json está na raiz do projeto.');
  process.exit(1);
}

// Ler o arquivo de Service Account
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

console.log('📋 Comandos para configurar no Vercel:\n');

const commands = [
  // Service Account
  `vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production "${serviceAccount.client_email}"`,
  `vercel env add GOOGLE_PRIVATE_KEY production "${serviceAccount.private_key}"`,
  `vercel env add GOOGLE_PRIVATE_KEY_ID production "${serviceAccount.private_key_id}"`,
  `vercel env add GOOGLE_PROJECT_ID production "${serviceAccount.project_id}"`,
  `vercel env add GOOGLE_CLIENT_ID production "${serviceAccount.client_id}"`,
  
  // OAuth2 (você precisa configurar manualmente)
  'vercel env add GOOGLE_OAUTH_CLIENT_ID production "SEU_OAUTH_CLIENT_ID"',
  'vercel env add GOOGLE_OAUTH_CLIENT_SECRET production "SEU_OAUTH_CLIENT_SECRET"',
  'vercel env add GOOGLE_OAUTH_REFRESH_TOKEN production "SEU_REFRESH_TOKEN"',
  
  // Outras variáveis
  'vercel env add GOOGLE_SPREADSHEET_ID production "17SzKfUugqko4XZyp10WYc7GOaN7nt__vNW5PjPp5pKw"',
  'vercel env add SMTP_PASS production "SUA_SENHA_DE_APP_GMAIL"',
  'vercel env add NEXT_PUBLIC_SITE_URL production "https://sua-url.vercel.app"'
];

commands.forEach((command, index) => {
  console.log(`${index + 1}. ${command}`);
});

console.log('\n📝 Instruções:');
console.log('1. Execute os comandos acima no terminal');
console.log('2. Para as variáveis OAuth2, você precisa:');
console.log('   - Ir para https://console.cloud.google.com/');
console.log('   - Configurar OAuth2 e obter as credenciais');
console.log('   - Gerar um refresh token no OAuth Playground');
console.log('3. Para SMTP_PASS, gere uma senha de app no Gmail');
console.log('4. Após configurar todas as variáveis, faça redeploy:');
console.log('   vercel --prod');

console.log('\n✅ Após configurar, as integrações funcionarão em produção!');
