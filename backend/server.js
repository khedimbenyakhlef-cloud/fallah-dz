const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
const PORT = process.env.PORT || 7860;
app.use(cors());
app.use(express.static('public'));

app.use(express.json({ limit: '20mb' }));
app.use((req, res, next) => { console.log(new Date().toISOString() + ' ' + req.method + ' ' + req.path); next(); });

const GROQ_KEYS = [process.env.GROQ_KEY_1||'', process.env.GROQ_KEY_2||''].filter(Boolean);
let reqCount = 0;

function getNextKey() {
  if (GROQ_KEYS.length === 0) return null;
  const key = GROQ_KEYS[reqCount % GROQ_KEYS.length];
  console.log('[GROQ] Req #' + (reqCount+1) + ' — Cle #' + (reqCount % GROQ_KEYS.length + 1));
  reqCount++;
  return key;
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'FellaH API', version: '2.0.0',
    founder: 'KHEDIM BENYAKHLEF DIT BENY JOE',
    activeKey: (reqCount % Math.max(GROQ_KEYS.length,1)) + 1,
    keysLoaded: GROQ_KEYS.length, uptime: Math.floor(process.uptime()) + 's' });
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message requis' });
  const apiKey = getNextKey();
  if (!apiKey) return res.status(500).json({ error: 'Aucune cle Groq' });
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'انت مساعد زراعي للفلاحين الجزائريين. تتحدث بالدارجة.' },
          ...history.slice(-6),
          { role: 'user', content: message }
        ],
        max_tokens: 700
      })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    res.json({ reply: d.choices[0].message.content });
  } catch (err) {
    console.error('[CHAT ERROR]', err.message);
    res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
});

app.post('/api/disease', async (req, res) => {
  const { imageBase64, mediaType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Image requise' });
  const apiKey = getNextKey();
  if (!apiKey) return res.status(500).json({ error: 'Aucune cle Groq' });
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: [
          { type: 'image_url', image_url: { url: 'data:' + (mediaType||'image/jpeg') + ';base64,' + imageBase64 } },
          { type: 'text', text: 'انت خبير زراعي. حلل هذه الصورة بالعربية.' }
        ]}],
        max_tokens: 600
      })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    res.json({ result: d.choices[0].message.content });
  } catch (err) {
    console.error('[DISEASE ERROR]', err.message);
    res.json({ result: 'تعذر تحليل الصورة. حاول مرة اخرى.' });
  }
});


// Keep-Alive: ping every 10 minutes
setInterval(() => {
  const http = require('http');
  http.get('http://localhost:' + (process.env.PORT || 10000) + '/').on('error', ()=>{});
  console.log('[PING] Keep-alive ping sent');
}, 600000);

app.listen(PORT, () => console.log('FellaH API — Port: ' + PORT + ' — Cles: ' + GROQ_KEYS.length));
