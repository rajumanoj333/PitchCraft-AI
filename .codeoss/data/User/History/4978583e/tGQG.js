// services/lingoService.js
const fetch = require('node-fetch');

const localizeContent = async (content, targetLang = 'es') => {
  try {
    const response = await fetch('https://api.lingo.dev/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINGO_DEV_API_KEY}`
      },
      body: JSON.stringify({
        text: content,
        target_lang: targetLang
      })
    });
    
    const data = await response.json();
    return data.translated_text;
  } catch (error) {
    console.error('Lingo.dev Error:', error);
    return content; // Return original on failure
  }
};

module.exports = { localizeContent };