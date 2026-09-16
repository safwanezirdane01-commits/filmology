const fs = require('fs');

const file = fs.readFileSync('src/lib/catalog.ts', 'utf8');
const regex = /"videoUrl":\s*"([^"]+)"/g;
let match;
let total = 0;
let invalid = [];

while ((match = regex.exec(file)) !== null) {
  total++;
  const val = match[1].trim();
  const isValid = /^tt\d+$/i.test(val) || /^(tv:)?\d+$/.test(val) || val.startsWith('http');
  if (!isValid) {
    invalid.push(val);
  }
}

console.log('Total catalog entries:', total);
console.log('Invalid count:', invalid.length);
if (invalid.length > 0) {
  console.log('Invalid entries:', invalid);
}
