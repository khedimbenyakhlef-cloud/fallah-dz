var fs = require('fs');
var c = fs.readFileSync('frontend/index.html', 'utf8');

// Augmenter timeout backend a 60 secondes
c = c.replace(
  "    try {\n      const res = await fetch(`${BACKEND_URL}/api/chat`, {",
  "    try {\n      const controller = new AbortController();\n      const timeout = setTimeout(() => controller.abort(), 60000);\n      const res = await fetch(`${BACKEND_URL}/api/chat`, {\n        signal: controller.signal,"
);

c = c.replace(
  "        body: JSON.stringify({ message: text, history: chatHistory.slice(-6) })\n      });",
  "        body: JSON.stringify({ message: text, history: chatHistory.slice(-6) })\n      });\n      clearTimeout(timeout);"
);

fs.writeFileSync('frontend/index.html', c, 'utf8');
console.log('OK fix5!');
