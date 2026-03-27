const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const ids = content.match(/id="[^"]*"/g) || [];
const idCounts = {};
ids.forEach(id => {
  idCounts[id] = (idCounts[id] || 0) + 1;
});
Object.keys(idCounts).forEach(id => {
  if (idCounts[id] > 1) {
    console.log(`Duplicate ID found: ${id} (${idCounts[id]} times)`);
  }
});
