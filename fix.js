var fs = require('fs');
var c = fs.readFileSync('frontend/index.html', 'utf8');

// Compter avant
var avant = (c.match(/if \(!apiKey\)/g) || []).length;
console.log('Avant:', avant, 'occurrences');

// Fix 1 - dans sendChat (2 espaces)
c = c.replace(
  "const apiKey = getGroqKey();\n  if (!apiKey) {\n    addMsg('\u2699\ufe0f \u0623\u062f\u062e\u0644 \u0645\u0641\u062a\u0627\u062d Groq \u0641\u064a \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0644\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a', 'ai');\n    return;\n  }",
  "const apiKey = getGroqKey();"
);

// Fix 2 - dans analyzePlant (4 espaces)
c = c.replace(
  "const apiKey = getGroqKey();\n    if (!apiKey) {\n      showDiseaseResult('\u2699\ufe0f \u0623\u062f\u062e\u0644 \u0645\u0641\u062a\u0627\u062d Groq \u0641\u064a \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0644\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u062a\u0634\u062e\u064a\u0635 \u0627\u0644\u0630\u0643\u064a.', true);\n      return;\n    }",
  "const apiKey = getGroqKey();"
);

// Compter après
var apres = (c.match(/if \(!apiKey\)/g) || []).length;
console.log('Après:', apres, 'occurrences');

fs.writeFileSync('frontend/index.html', c, 'utf8');
console.log('OK!');
