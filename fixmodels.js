var fs = require('fs');
var c = fs.readFileSync('backend/server.js', 'utf8');

// Remplacer le systeme de rotation par cles + modeles
var oldRotation = "// === ROTATION DES CLÉS GROQ ===\nconst GROQ_KEYS = [\n  process.env.GROQ_KEY_1 || 'gsk_VOTRE_CLE_GROQ_1_ICI',\n  process.env.GROQ_KEY_2 || 'gsk_VOTRE_CLE_GROQ_2_ICI'\n];\n\nlet currentKeyIndex = 0;\nconst keyUsageCount = [0, 0];\nconst KEY_ROTATION_LIMIT = 1; // Rotate every 50 requests\n\nfunction getNextGroqKey() {\n  keyUsageCount[currentKeyIndex]++;\n  if (keyUsageCount[currentKeyIndex] >= KEY_ROTATION_LIMIT) {\n    keyUsageCount[currentKeyIndex] = 0;\n    currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;\n    console.log(`[GROQ] Rotation vers clé #${currentKeyIndex + 1}`);\n  }\n  return GROQ_KEYS[currentKeyIndex];\n}";

var newRotation = "// === ROTATION CLES + MODELES GROQ ===\nconst GROQ_KEYS = [\n  process.env.GROQ_KEY_1 || 'gsk_VOTRE_CLE_GROQ_1_ICI',\n  process.env.GROQ_KEY_2 || 'gsk_VOTRE_CLE_GROQ_2_ICI'\n];\n\nconst GROQ_MODELS = [\n  'llama-3.3-70b-versatile',\n  'llama-3.1-70b-versatile',\n  'llama3-8b-8192',\n  'gemma2-9b-it',\n  'mixtral-8x7b-32768'\n];\n\nlet reqCount = 0;\n\nfunction getNextGroqKey() {\n  const key = GROQ_KEYS[reqCount % GROQ_KEYS.length];\n  return key;\n}\n\nfunction getNextGroqModel() {\n  const model = GROQ_MODELS[reqCount % GROQ_MODELS.length];\n  reqCount++;\n  console.log(`[GROQ] Requete #${reqCount} — Cle #${(reqCount % GROQ_KEYS.length)+1} — Modele: ${model}`);\n  return model;\n}";

c = c.replace(oldRotation, newRotation);

// Utiliser getNextGroqModel() dans /api/chat
c = c.replace(
  "  const apiKey = getNextGroqKey();\n\n  const messages = [",
  "  const apiKey = getNextGroqKey();\n  const model = getNextGroqModel();\n\n  const messages = ["
);

// Remplacer le modele hardcode dans /api/chat
c = c.replace(
  "        model: 'llama-3.3-70b-versatile',\n        messages,",
  "        model: model,\n        messages,"
);

fs.writeFileSync('backend/server.js', c, 'utf8');
console.log('OK models rotation!');
