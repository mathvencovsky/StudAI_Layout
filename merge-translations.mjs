import fs from 'fs';

// Helper to convert dot-notation to kebab-case
function dotToKebab(key) {
  return key.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Read en-US.ts
const enUSContent = fs.readFileSync('./src/i18n/en-US.ts', 'utf-8');
const enUSMatch = enUSContent.match(/export const enUS[^=]*=\s*({[\s\S]*?});/);
const enUSStr = enUSMatch[1];

// Parse the object manually to avoid eval
const enUSObj = {};
const keyValueRegex = /"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"/g;
let match;
while ((match = keyValueRegex.exec(enUSStr)) !== null) {
  enUSObj[match[1]] = match[2];
}

// Read current common.ts
const commonContent = fs.readFileSync('./src/i18n/locales/en/common.ts', 'utf-8');
const commonMatch = commonContent.match(/export default\s*({[\s\S]*?})\s*as const;/);
const commonStr = commonMatch[1];

// Parse common.ts
const commonObj = {};
const commonKeyValueRegex = /"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"/g;
while ((match = commonKeyValueRegex.exec(commonStr)) !== null) {
  commonObj[match[1]] = match[2];
}

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
