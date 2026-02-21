import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

function dotToKebab(str) {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

async function updateAllFiles() {
  // Find all tsx/ts files in src
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['src/i18n/**', 'node_modules/**'],
  });

  let updatedCount = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Replace all t("...") calls
    content = content.replace(/t\("([^"]+)"\)/g, (match, key) => {
      const newKey = dotToKebab(key);
      return `t("${newKey}")`;
    });

    // Replace all t('...') calls
    content = content.replace(/t\('([^']+)'\)/g, (match, key) => {
      const newKey = dotToKebab(key);
      return `t('${newKey}')`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      updatedCount++;
      console.log(`✓ Updated ${path.relative('.', filePath)}`);
    }
  }

  console.log(`\n✓ Updated ${updatedCount} files`);
}

updateAllFiles().catch(console.error);
