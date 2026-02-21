const fs = require('fs');

// Helper to convert dot-notation to kebab-case
function dotToKebab(key) {
  return key.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Read en-US.ts
const enUSContent = fs.readFileSync('./src/i18n/en-US.ts', 'utf-8');
const enUSMatch = enUSContent.match(/export const enUS[^=]*=\s*({[\s\S]*?});/);
const enUSObj = eval('(' + enUSMatch[1] + ')');

// Read current common.ts
const commonContent = fs.readFileSync('./src/i18n/locales/en/common.ts', 'utf-8');
const commonMatch = commonContent.match(/export default\s*({[\s\S]*?})\s*as const;/);
const commonObj = eval('(' + commonMatch[1] + ')');

// Merge: landing page keys take precedence, convert to kebab-case
const merged = { ...commonObj };
for (const [key, value] of Object.entries(enUSObj)) {
  const kebabKey = dotToKebab(key);
  merged[kebabKey] = value;
}

// Sort alphabetically
const sorted = {};
Object.keys(merged).sort().forEach(key => {
  sorted[key] = merged[key];
});

// Generate new file content
const newContent = `export default ${JSON.stringify(sorted, null, 2)} as const;`;

console.log('Merged keys:', Object.keys(sorted).length);
console.log('Sample keys:', Object.keys(sorted).slice(0, 10));

// Write to file
fs.writeFileSync('./src/i18n/locales/en/common.ts', newContent);
console.log('✓ Updated src/i18n/locales/en/common.ts');
