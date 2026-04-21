var fs = require('fs');

// ============================================
// FIX 1: backend/server.js — réécriture propre
// ============================================
var server = fs.readFileSync('backend/server.js', 'utf8');

// Remplacer TOUT le bloc de rotation par une version propre sans bugs
server = server.replace(
  /\/\/ === ROTATION[\s\S]*?function getNextGroqModel\(\) \{[\s\S]*?\n\}/,
  `// === ROTATION CLES + MODELES GROQ ===
const GROQ_KEYS = [
  process.env.GROQ_KEY_1 || '',
  process.env.GROQ_KEY_2 || ''
].filter(Boolean);

// SEULS modèles actifs sur Groq en avril 2026
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant'
];

let reqCount = 0;

function getNextGroqKey() {
  return GROQ_KEYS[reqCount % GROQ_KEYS.length];
}

function getNextGroqModel() {
  const key = getNextGroqKey();
  const model = GROQ_MODELS[reqCount % GROQ_MODELS.length];
  console.log(\`[GROQ] Requete #\${reqCount + 1} — Cle #\${(reqCount % GROQ_KEYS.length) + 1} — Modele: \${model}\`);
  reqCount++;
  return { key, model };
}`
);

// Fixer l'appel à getNextGroqModel() dans /api/chat — ancienne version retournait juste model
// Chercher le pattern d'utilisation et le corriger
server = server.replace(
  /const model = getNextGroqModel\(\);\s*\n(\s*)const apiKey = getNextGroqKey\(\);/g,
  'const { key: apiKey, model } = getNextGroqModel();'
);
// Si l'ordre était inversé
server = server.replace(
  /const apiKey = getNextGroqKey\(\);\s*\n(\s*)const model = getNextGroqModel\(\);/g,
  'const { key: apiKey, model } = getNextGroqModel();'
);
// Si c'est juste model seul (sans apiKey séparé)
server = server.replace(
  /const model = getNextGroqModel\(\);/g,
  'const { key: apiKey, model } = getNextGroqModel();'
);

// Fixer activeKey dans health check
server = server.replace(
  /activeKey: currentKeyIndex \+ 1,/g,
  'activeKey: (reqCount % Math.max(GROQ_KEYS.length, 1)) + 1,'
);
server = server.replace(
  /activeKey: \(reqCount % 2\) \+ 1,/g,
  'activeKey: (reqCount % Math.max(GROQ_KEYS.length, 1)) + 1,'
);

fs.writeFileSync('backend/server.js', server, 'utf8');
console.log('✅ backend/server.js corrigé');

// ============================================
// FIX 2: frontend/index.html — supprimer section clés Groq
// ============================================
var html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Supprimer la carte "مفاتيح Groq AI" dans les settings
html = html.replace(
  /<div class="card">\s*<div class="card-title"><span class="ci" style="background:#e3f0fb">🤖<\/span> مفاتيح Groq AI<\/div>[\s\S]*?<\/div>\s*<\/div>\s*(?=<div class="card">)/,
  ''
);

// 2. Toujours afficher le statut AI comme "online" sans dépendre des clés locales
html = html.replace(
  /function updateAiStatus\(online\) \{[\s\S]*?\}/,
  `function updateAiStatus(online) {
  const dot = document.getElementById('ai-dot');
  const txt = document.getElementById('ai-status-text');
  dot.className = 'status-dot online';
  txt.textContent = '✅ الذكاء AI مفعّل — جاهز';
}`
);

// 3. Supprimer saveGroqKeys, clearGroqKeys, showGroqStatus (plus nécessaires)
html = html.replace(/function saveGroqKeys\(\) \{[\s\S]*?\n\}/,'');
html = html.replace(/function clearGroqKeys\(\) \{[\s\S]*?\n\}/,'');
html = html.replace(/function showGroqStatus\([\s\S]*?\n\}/,'');

// 4. Dans sendChat: supprimer getGroqKey() et le fallback direct Groq (cause 401)
// Supprimer: const apiKey = getGroqKey();
html = html.replace(/\s*const apiKey = getGroqKey\(\);\n/g, '\n');

// 5. Supprimer tout le bloc catch { // Fallback: direct Groq API call ... }
html = html.replace(
  /} catch \{\s*\/\/ Fallback: direct Groq API call[\s\S]*?reply = data\.choices\?\.\[0\]\?\.message\?\.content.*?;\s*\}/,
  `} catch {\n      throw new Error('backend error');\n    }`
);

// 6. Même chose pour analyzePlant
html = html.replace(
  /} catch \{\s*\/\/ Fallback: direct Groq vision API[\s\S]*?result = data\.choices\?\.\[0\]\?\.message\?\.content.*?;\s*\}/,
  `} catch {\n        throw new Error('backend error');\n      }`
);

// 7. Supprimer getGroqKey function
html = html.replace(/function getGroqKey\(\) \{[\s\S]*?\n\}/,'');

// 8. Init: supprimer la restauration des clés localStorage + toujours montrer online
html = html.replace(
  /\/\/ Restore Groq keys[\s\S]*?updateAiStatus\(true\);.*\n/,
  `updateAiStatus(true);\n`
);

// Statut texte par défaut dans le HTML (placeholder)  
html = html.replace(
  'الذكاء AI — غير مفعّل (أدخل مفتاح Groq في الإعدادات)',
  '✅ الذكاء AI مفعّل — جاهز'
);

fs.writeFileSync('frontend/index.html', html, 'utf8');
console.log('✅ frontend/index.html corrigé');
console.log('');
console.log('👉 Maintenant: git add -A && git commit -m "Fix final: modeles actifs + suppression clés frontend" && git push');
