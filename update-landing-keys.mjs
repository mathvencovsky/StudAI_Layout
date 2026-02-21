import fs from 'fs';
import path from 'path';

function dotToKebab(str) {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace all t("...") calls
  content = content.replace(/t\("([^"]+)"\)/g, (match, key) => {
    const newKey = dotToKebab(key);
    return `t("${newKey}")`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated ${path.basename(filePath)}`);
}

const files = [
  'src/components/landing/trust-section.tsx',
  'src/components/landing/pricing-section.tsx',
  'src/components/landing/faq-section.tsx',
  'src/components/landing/auth-card.tsx',
  'src/components/landing/testimonials.tsx',
  'src/components/landing/how-it-works.tsx',
  'src/components/landing/logo-strip-section.tsx',
];

files.forEach(updateFile);
console.log('✓ All files updated');
