const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// POST /api/translate
router.post('/', async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) return res.status(400).json({ error: 'Missing text or target language' });

  // Example: Use Google Translate API (replace with your API key)
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target })
    });
    const data = await response.json();
    if (!data.data || !data.data.translations) throw new Error('Translation failed');
    res.json({ translation: data.data.translations[0].translatedText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
