var fs = require('fs');
var c = fs.readFileSync('backend/server.js', 'utf8');

// Fix modele decommissionne
c = c.replace(/llama3-70b-8192/g, 'llama-3.3-70b-versatile');

// Fix rotation - reduire limite a 14 pour maximiser tokens (Groq = 14400 req/day par cle)
c = c.replace('const KEY_ROTATION_LIMIT = 50;', 'const KEY_ROTATION_LIMIT = 1;');

fs.writeFileSync('backend/server.js', c, 'utf8');
console.log('OK!');
