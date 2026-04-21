var fs = require('fs');
var c = fs.readFileSync('backend/server.js', 'utf8');

// Fix 1: Only use confirmed active models in 2026
c = c.replace(
  /const GROQ_MODELS = \[[\s\S]*?\];/,
  "const GROQ_MODELS = [\n  'llama-3.3-70b-versatile',\n  'gemma2-9b-it',\n  'llama-3.1-8b-instant'\n];"
);

// Fix 2: Fix getNextGroqKey - it used currentKeyIndex which no longer exists
c = c.replace(
  /function getNextGroqKey\(\) \{[\s\S]*?\}/,
  "function getNextGroqKey() {\n  const key = GROQ_KEYS[reqCount % GROQ_KEYS.length];\n  return key;\n}"
);

// Fix 3: activeKey in health check
c = c.replace('activeKey: currentKeyIndex + 1,', 'activeKey: (reqCount % GROQ_KEYS.length) + 1,');

fs.writeFileSync('backend/server.js', c, 'utf8');
console.log('server.js fixed!');
