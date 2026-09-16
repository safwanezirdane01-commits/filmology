const fs = require('fs');

const file = fs.readFileSync('src/lib/catalog.ts', 'utf8');
const lines = file.split('\n');

let count = 0;
let invalid = [];

lines.forEach((line, idx) => {
  if (line.includes('videoUrl:')) {
    count++;
    const match = line.match(/videoUrl:\s*["']([^"']+)["']/);
    if (match) {
      const val = match[1].trim();
      const isValid = /^tt\d+$/i.test(val) || /^\d+$/.test(val) || val.startsWith('http');
      if (!isValid) {
        invalid.push({ line: idx + 1, val });
      }
    }
  }
});

console.log('Total videoUrl entries in catalog:', count);
console.log('Invalid videoUrl entries count:', invalid.length);
if (invalid.length > 0) {
  console.log('Sample invalid:', invalid.slice(0, 10));
}
