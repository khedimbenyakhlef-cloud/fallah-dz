var fs = require('fs');
var c = fs.readFileSync('frontend/index.html', 'utf8');

// Fix statut toujours online au chargement
c = c.replace(
  "  if (k1 || k2) {\n    const count = [k1,k2].filter(Boolean).length;\n    showGroqStatus('ok', `✅ ${count} مفتاح محفوظ — التناوب مفعّل`);\n    updateAiStatus(true);\n  }",
  "  updateAiStatus(true);\n  showGroqStatus('ok', '✅ الذكاء AI مفعّل — الخادم جاهز');"
);

// Sauvegarder la wilaya
c = c.replace(
  "function updateRegion(region) {\n  document.querySelectorAll('.weather-location').forEach(el => {\n    el.textContent = `📍 ${region}، الجزائر`;\n  });\n}",
  "function updateRegion(region) {\n  localStorage.setItem('fellah_wilaya', region);\n  document.querySelectorAll('.weather-location').forEach(el => {\n    el.textContent = `📍 ${region}، الجزائر`;\n  });\n}"
);

fs.writeFileSync('frontend/index.html', c, 'utf8');
console.log('OK fix2!');
