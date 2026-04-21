const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use((req, res, next) => {
  console.log('[' + new Date().toISOString() + '] ' + req.method + ' ' + req.path);
  next();
});

const GROQ_KEYS = [
  process.env.GROQ_KEY_1 || '',
  process.env.GROQ_KEY_2 || ''
].filter(Boolean);

let reqCount = 0;

function getNextKey() {
  if (GROQ_KEYS.length === 0) return null;
  const key = GROQ_KEYS[reqCount % GROQ_KEYS.length];
  console.log('[GROQ] Requete #' + (reqCount+1) + ' — Cle #' + (reqCount % GROQ_KEYS.length + 1));
  reqCount++;
  return key;
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'FellaH API', version: '2.0.0', founder: 'KHEDIM BENYAKHLEF DIT BENY JOE', activeKey: (reqCount % Math.max(GROQ_KEYS.length,1)) + 1, keysLoaded: GROQ_KEYS.length, uptime: Math.floor(process.uptime()) + 's' });
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  const apiKey = getNextKey();
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: 'انت مساعد زراعي للفلاحين الجزائريين. تتحدث بالدارجة الجزائرية.' }, ...history.slice(-6), { role: 'user', content: message }], max_tokens: 700 })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('[CHAT ERROR]', err.message);
    res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
});

app.post('/api/disease', async (req, res) => {
  const { imageBase64, mediaType } = req.body;
  const apiKey = getNextKey();
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: 'data:' + (mediaType||'image/jpeg') + ';base64,' + imageBase64 } }, { type: 'text', text: 'انت خبير زراعي. حلل هذه الصورة واجب بالعربية.' }] }], max_tokens: 600 })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error('[DISEASE ERROR]', err.message);
    res.json({ result: 'تعذر تحليل الصورة. حاول مرة اخرى.' });
  }
});

app.listen(PORT, () => console.log('FellaH API port ' + PORT + ' — Cles: ' + GROQ_KEYS.length));