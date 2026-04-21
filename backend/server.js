// =============================================
// FELLAH — Backend Server (Node.js + Express)
// Fondé par KHEDIM BENYAKHLEF DIT BENY JOE
// Déploiement: Render.com (background worker)
// =============================================

const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
const PORT = process.env.PORT || 3001;

// === ROTATION CLES + MODELES GROQ ===
const GROQ_KEYS = [
  process.env.GROQ_KEY_1 || 'gsk_VOTRE_CLE_GROQ_1_ICI',
  process.env.GROQ_KEY_2 || 'gsk_VOTRE_CLE_GROQ_2_ICI'
];

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-8b-8192',
  'gemma2-9b-it',
  'mixtral-8x7b-32768'
];

let reqCount = 0;

function getNextGroqKey() {
  const key = GROQ_KEYS[reqCount % GROQ_KEYS.length];
  return key;
}

function getNextGroqModel() {
  const model = GROQ_MODELS[reqCount % GROQ_MODELS.length];
  reqCount++;
  console.log(`[GROQ] Requete #${reqCount} — Cle #${(reqCount % GROQ_KEYS.length)+1} — Modele: ${model}`);
  return model;
}

// === MIDDLEWARE ===
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// === ROUTES ===

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FellaH API',
    version: '2.0.0',
    founder: 'KHEDIM BENYAKHLEF DIT BENY JOE',
    activeKey: currentKeyIndex + 1,
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// === AI CHAT (Groq - llama3) ===
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message requis' });

  const apiKey = getNextGroqKey();
  const model = getNextGroqModel();

  const messages = [
    {
      role: 'system',
      content: `أنت مساعد زراعي ذكي متخصص للفلاحين الجزائريين. اسمك "فلاح AI".
تتحدث بالدارجة الجزائرية أو العربية الفصحى حسب السؤال.
تعطي نصائح عملية عن الزراعة في الجزائر: المحاصيل، الأمراض، السقي، الأسمدة، الأسواق.
أنت تعرف التقاليد الجزائرية وأسماء المحاصيل المحلية.
كن مختصراً وعملياً ومفيداً. لا تتحدث عن موضوع خارج الزراعة.
صُنعت بواسطة: KHEDIM BENYAKHLEF DIT BENY JOE`
    },
    ...history.slice(-6),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json();
      // Try next key on rate limit
      if (response.status === 429) {
        currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
        return res.status(429).json({ error: 'Rate limit, retry in 1s', retry: true });
      }
      throw new Error(err.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'عذراً، حاول مرة أخرى.';
    res.json({ reply, keyUsed: currentKeyIndex + 1 });

  } catch (err) {
    console.error('[CHAT ERROR]', err.message);
    res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
});

// === DISEASE DETECTION (Image analysis via Groq vision) ===
app.post('/api/disease', async (req, res) => {
  const { imageBase64, mediaType = 'image/jpeg' } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Image requise' });

  const apiKey = getNextGroqKey();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mediaType};base64,${imageBase64}` }
            },
            {
              type: 'text',
              text: `أنت خبير زراعي للجزائر. حلل هذه الصورة للنبتة وأجب بالعربية على هذا الشكل:
**التشخيص:** [اسم المرض أو المشكلة]
**الأعراض:** [ما تراه في الصورة]
**السبب:** [سبب المرض]
**العلاج:** [الحل العملي المتوفر في الجزائر]
**الوقاية:** [كيف تتجنبه مستقبلاً]`
            }
          ]
        }],
        max_tokens: 600
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'لم يتمكن من التشخيص.';
    res.json({ result });

  } catch (err) {
    console.error('[DISEASE ERROR]', err.message);
    res.status(500).json({ error: 'Erreur analyse: ' + err.message });
  }
});

// === MARKET PRICES (simulated + updatable) ===
app.get('/api/prices', (req, res) => {
  const prices = [
    { name: '🍅 طماطم', emoji: '🍅', price: 65, change: +8, unit: 'كغ' },
    { name: '🥔 بطاطا', emoji: '🥔', price: 35, change: -5, unit: 'كغ' },
    { name: '🌶️ فلفل', emoji: '🌶️', price: 120, change: +15, unit: 'كغ' },
    { name: '🧅 بصل', emoji: '🧅', price: 28, change: 0, unit: 'كغ' },
    { name: '🥕 جزر', emoji: '🥕', price: 42, change: +6, unit: 'كغ' },
    { name: '🥬 كوسة', emoji: '🥬', price: 18, change: -12, unit: 'كغ' },
    { name: '🌽 ذرة', emoji: '🌽', price: 22, change: 0, unit: 'كغ' },
    { name: '🧄 ثوم', emoji: '🧄', price: 320, change: +4, unit: 'كغ' },
  ];
  res.json({ prices, updatedAt: new Date().toISOString() });
});

// === WEATHER TIP ===
app.get('/api/weather-tip', async (req, res) => {
  const { temp = 30, condition = 'sunny' } = req.query;
  res.json({
    tip: temp > 35
      ? '🌡️ حرارة شديدة — اسقِ في الفجر أو المساء فقط وغطِّ الشتلات الصغيرة'
      : temp < 10
      ? '❄️ برد — احمِ المحاصيل الحساسة وقلل السقي'
      : '✅ طقس مناسب للعمل الزراعي اليوم'
  });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🌾 FELLAH API — v2.0.0                ║
║  Fondé par KHEDIM BENYAKHLEF (BENY JOE)║
║  Port: ${PORT}                           ║
║  Clés Groq: ${GROQ_KEYS.length} (rotation automatique)  ║
╚════════════════════════════════════════╝
  `);
});
