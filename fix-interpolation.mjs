import fs from 'fs';

// Fix English
let enContent = fs.readFileSync('./src/i18n/locales/en/common.ts', 'utf-8');
enContent = enContent.replace(
  /"pricing-waitlist-body": "[^"]*{profile}[^"]*"/,
  '"pricing-waitlist-body": "Hi, I\'d like to join the StudAI Pro waitlist.\\n\\nProfile: {{profile}}\\nEmail: \\n\\nThank you."'
);
fs.writeFileSync('./src/i18n/locales/en/common.ts', enContent);
console.log('✓ Fixed English pricing-waitlist-body');

// Fix Portuguese
let ptContent = fs.readFileSync('./src/i18n/locales/pt-BR/common.ts', 'utf-8');
ptContent = ptContent.replace(
  /"pricing-waitlist-body": "[^"]*{profile}[^"]*"/,
  '"pricing-waitlist-body": "Oi, gostaria de entrar na lista de espera do StudAI Pro.\\n\\nPerfil: {{profile}}\\nEmail: \\n\\nObrigado."'
);
fs.writeFileSync('./src/i18n/locales/pt-BR/common.ts', ptContent);
console.log('✓ Fixed Portuguese pricing-waitlist-body');
