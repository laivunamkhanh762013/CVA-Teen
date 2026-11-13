const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('swarm-cursors-overlay');
console.log('swarm overlay chunk:');
console.log(html.slice(idx - 100, idx + 400));
