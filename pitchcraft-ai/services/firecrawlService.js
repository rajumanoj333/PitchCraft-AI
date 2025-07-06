// services/firecrawlService.js
const fetch = require('node-fetch');

const researchIdea = async (idea) => {
  try {
    const response = await fetch('https://api.firecrawl.dev/v0/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({ query: idea })
    });
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Firecrawl Error:', error);
    return [];
  }
};

module.exports = { researchIdea };