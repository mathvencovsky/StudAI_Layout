#!/bin/bash

# Update all translation keys from dot-notation to kebab-case in landing components

files=(
  "src/components/landing/trust-section.tsx"
  "src/components/landing/pricing-section.tsx"
  "src/components/landing/faq-section.tsx"
  "src/components/landing/auth-card.tsx"
  "src/components/landing/testimonials.tsx"
  "src/components/landing/how-it-works.tsx"
  "src/components/landing/logo-strip-section.tsx"
)

for file in "${files[@]}"; do
  # Replace all dot-notation keys with kebab-case
  sed -i '' 's/t("\([^"]*\)\.\([^"]*\)")/t("\1-\2")/g' "$file"
  sed -i '' 's/t("\([^"]*\)-\([^"]*\)\.\([^"]*\)")/t("\1-\2-\3")/g' "$file"
  sed -i '' 's/t("\([^"]*\)-\([^"]*\)-\([^"]*\)\.\([^"]*\)")/t("\1-\2-\3-\4")/g' "$file"
  sed -i '' 's/t("\([^"]*\)-\([^"]*\)-\([^"]*\)-\([^"]*\)\.\([^"]*\)")/t("\1-\2-\3-\4-\5")/g' "$file"
  
  # Handle camelCase to kebab-case conversion
  sed -i '' 's/\([a-z]\)\([A-Z]\)/\1-\2/g' "$file"
  
  echo "Updated $file"
done
