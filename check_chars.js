const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
for (let i = 0; i < content.length; i++) {
  if (content.charCodeAt(i) > 127) {
    console.log(`Non-ASCII character found at index ${i}: ${content[i]} (code: ${content.charCodeAt(i)})`);
  }
}
