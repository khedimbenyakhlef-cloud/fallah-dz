var fs = require('fs');
var c = fs.readFileSync('frontend/index.html', 'utf8');

// Reveiller le backend au chargement
c = c.replace(
  "  // Restore wilaya",
  "  // Reveiller backend\n  fetch('https://fallah-dz.onrender.com/').catch(()=>{});\n  // Restore wilaya"
);

// Statut toujours online
c = c.replace(
  "updateAiStatus(true);",
  "updateAiStatus(true); document.getElementById('ai-dot').className='status-dot online'; document.getElementById('ai-status-text').textContent='✅ الذكاء AI مفعّل — جاهز';"
);

fs.writeFileSync('frontend/index.html', c, 'utf8');
console.log('OK fix4!');
