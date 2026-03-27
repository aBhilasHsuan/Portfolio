const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const tags = content.match(/<[a-z0-9-]+/gi) || [];
const tagCounts = {};
tags.forEach(tag => {
  const tagName = tag.substring(1).toLowerCase();
  tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
});

const closingTags = content.match(/<\/([a-z0-9-]+)/gi) || [];
const closingTagCounts = {};
closingTags.forEach(tag => {
  const tagName = tag.substring(2).trim().toLowerCase();
  closingTagCounts[tagName] = (closingTagCounts[tagName] || 0) + 1;
});

// For self-closing tags like img, meta, link, br, hr, input.
const selfClosingTags = ['img', 'meta', 'link', 'br', 'hr', 'input', '!doctype'];

Object.keys(tagCounts).forEach(tagName => {
  if (!selfClosingTags.includes(tagName)) {
    const opening = tagCounts[tagName];
    const closing = closingTagCounts[tagName] || 0;
    if (opening !== closing) {
      console.log(`Tag mismatch for <${tagName}>: opening=${opening}, closing=${closing}`);
    }
  }
});
