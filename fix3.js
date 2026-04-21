var fs = require('fs');
var c = fs.readFileSync('frontend/index.html', 'utf8');

// Fix 1: Statut toujours online
c = c.replace(
  'الذكاء AI — غير مفعّل (أدخل مفتاح Groq في الإعدادات)',
  '✅ الذكاء AI مفعّل — جاهز'
);

// Fix 2: updateAiStatus toujours true au load
c = c.replace(
  "  if (k1 || k2) {\n    const count = [k1,k2].filter(Boolean).length;\n    showGroqStatus('ok', `\u2705 ${count} \u0645\u0641\u062a\u0627\u062d \u0645\u062d\u0641\u0648\u0638 \u2014 \u0627\u0644\u062a\u0646\u0627\u0648\u0628 \u0645\u0641\u0639\u0651\u0644`);\n    updateAiStatus(true);\n  }",
  "  updateAiStatus(true);"
);

// Fix 3: Sauvegarder wilaya
c = c.replace(
  "function updateRegion(region) {\n  document.querySelectorAll('.weather-location').forEach(el => {\n    el.textContent = `\ud83d\udccd ${region}\u060c \u0627\u0644\u062c\u0632\u0627\u0626\u0631`;\n  });\n}",
  "function updateRegion(region) {\n  localStorage.setItem('fellah_wilaya', region);\n  document.querySelectorAll('.weather-location, #hdr-location').forEach(el => {\n    el.textContent = region;\n  });\n}"
);

// Fix 4: Charger wilaya sauvegardée
c = c.replace(
  "  // Update date in hero",
  "  // Restore wilaya\n  var w = localStorage.getItem('fellah_wilaya');\n  if (w) {\n    var sel = document.querySelector('.setting-select');\n    if (sel) { for(var i=0;i<sel.options.length;i++){if(sel.options[i].value===w||sel.options[i].text===w){sel.selectedIndex=i;break;}} }\n    updateRegion(w);\n  }\n  // Update date in hero"
);

// Fix 5: 58 wilayas completes
c = c.replace(
  '<option selected>وهران</option><option>الجزائر</option><option>سطيف</option>\n          <option>معسكر</option><option>بسكرة</option><option>البليدة</option>\n          <option>عنابة</option><option>قسنطينة</option><option>تلمسان</option>',
  '<option>أدرار</option><option>الشلف</option><option>الأغواط</option><option>أم البواقي</option><option>باتنة</option><option>بجاية</option><option>بسكرة</option><option>بشار</option><option>البليدة</option><option>البويرة</option><option>تمنراست</option><option>تبسة</option><option>تلمسان</option><option>تيارت</option><option>تيزي وزو</option><option>الجزائر</option><option>الجلفة</option><option>جيجل</option><option>سطيف</option><option>سعيدة</option><option>سكيكدة</option><option>سيدي بلعباس</option><option>عنابة</option><option>قالمة</option><option>قسنطينة</option><option>المدية</option><option>مستغانم</option><option>المسيلة</option><option>معسكر</option><option>ورقلة</option><option selected>وهران</option><option>البيض</option><option>إليزي</option><option>برج بوعريريج</option><option>بومرداس</option><option>الطارف</option><option>تندوف</option><option>تيسمسيلت</option><option>الوادي</option><option>خنشلة</option><option>سوق أهراس</option><option>تيبازة</option><option>ميلة</option><option>عين الدفلى</option><option>النعامة</option><option>عين تموشنت</option><option>غرداية</option><option>غليزان</option><option>تيميمون</option><option>برج باجي مختار</option><option>أولاد جلال</option><option>بني عباس</option><option>عين صالح</option><option>عين قزام</option><option>توقرت</option><option>جانت</option><option>المغير</option><option>المنيعة</option>'
);

// Fix 6: Supprimer section cles Groq - remplacer par message info
c = c.replace(
  '<div class="card">\n      <div class="card-title"><span class="ci" style="background:#e3f0fb">\ud83e\udd16</span> \u0645\u0641\u0627\u062a\u064a\u062d Groq AI</div>\n      <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">\u0623\u062f\u062e\u0644 \u0645\u0641\u062a\u0627\u062d\u064e\u064a Groq \u2014 \u0633\u064a\u062a\u0646\u0627\u0648\u0628\u0627\u0646 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b \u0644\u062a\u062c\u0646\u0651\u0628 \u0627\u0644\u062d\u062f \u0627\u0644\u064a\u0648\u0645\u064a. \u062a\u0628\u0642\u0649 \u0645\u062d\u0641\u0648\u0638\u0629 \u0641\u064a \u062c\u0647\u0627\u0632\u0643 \u0641\u0642\u0637.<\/p>',
  '<div class="card">\n      <div class="card-title"><span class="ci" style="background:#e8f5e9">\ud83e\udd16</span> \u062d\u0627\u0644\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 AI<\/div>\n      <div class="alert success"><span class="alert-icon">\u2705<\/span> \u0627\u0644\u0630\u0643\u0627\u0621 AI \u0645\u0641\u0639\u0651\u0644 \u0648\u062c\u0627\u0647\u0632 \u2014 \u0645\u062f\u0639\u0648\u0645 \u0628\u0640 Groq (llama3)<\/div>\n      <div class="alert info"><span class="alert-icon">\ud83d\udd11<\/span> \u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d \u0645\u062d\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u0627\u0644\u062e\u0627\u062f\u0645 \u2014 \u0644\u0627 \u062a\u062d\u062a\u0627\u062c \u0644\u0625\u062f\u062e\u0627\u0644 \u0623\u064a \u0645\u0641\u062a\u0627\u062d<\/div>\n      <p style="display:none">'
);

fs.writeFileSync('frontend/index.html', c, 'utf8');
console.log('OK fix3!');
