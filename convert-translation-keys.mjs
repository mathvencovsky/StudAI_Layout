import fs from 'fs';

function dotToKebab(str) {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function convertTranslationFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace all keys in the object
  content = content.replace(/"([^"]+)":/g, (match, key) => {
    const newKey = dotToKebab(key);
    return `"${newKey}":`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Converted ${filePath}`);
}

convertTranslationFile('src/i18n/locales/en/common.ts');
convertTranslationFile('src/i18n/locales/pt-BR/common.ts');
