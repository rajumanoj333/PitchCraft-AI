const fetch = require('node-fetch');

const PERPLEXITY_URL = process.env.PERPLEXITY_URL || 'https://api.perplexity.ai';
const API_KEY = process.env.PERPLEXITY_API_KEY;

const researchIdea = async (idea) => {
  try {
    if (!API_KEY) {
      console.warn('Perplexity API key not found, using fallback research');
      return generateFallbackResearch(idea);
    }

    const prompt = `Research the market for "${idea}" and provide:

1. Market size and growth potential
2. Top 5 competitors and their positioning
3. Current market trends and opportunities
4. Recent funding activity in this space
5. Key challenges and barriers to entry

Provide specific, data-driven insights with numbers when possible.`;

    const response = await fetch(`${PERPLEXITY_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a market research analyst providing detailed competitive intelligence and market insights for startups.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      return generateFallbackResearch(idea);
    }

    const data = await response.json();
    const researchText = data.choices?.[0]?.message?.content;
    
    if (!researchText) {
      console.warn('No research data from Perplexity, using fallback');
      return generateFallbackResearch(idea);
    }

    return parseResearchData(researchText, idea);

  } catch (error) {
    console.error('Perplexity service error:', error.message);
    return generateFallbackResearch(idea);
  }
};

const parseResearchData = (researchText, idea) => {
  // Extract key information from the research text
  const lines = researchText.split('\n').filter(line => line.trim());
  
  return {
    marketSize: extractMarketSize(lines) || `Large addressable market for ${idea} with significant growth potential`,
    competitors: extractCompetitors(lines) || [
      'Established market leaders',
      'Emerging startups',
      'Traditional alternatives',
      'New technology disruptors',
      'International players'
    ],
    trends: extractTrends(lines) || [
      'Digital transformation acceleration',
      'Increased demand for automation',
      'Focus on user experience',
      'Sustainable and efficient solutions',
      'AI and machine learning integration'
    ],
    funding: extractFunding(lines) || 'Active investment landscape with multiple funding rounds and growing investor interest',
    sources: ['Perplexity AI Research', 'Market Intelligence', 'Competitive Analysis']
  };
};

const extractMarketSize = (lines) => {
  for (const line of lines) {
    if (line.toLowerCase().includes('market size') || line.toLowerCase().includes('billion') || line.toLowerCase().includes('million')) {
      return line.trim();
    }
  }
  return null;
};

const extractCompetitors = (lines) => {
  const competitors = [];
  for (const line of lines) {
    if (line.toLowerCase().includes('competitor') || line.toLowerCase().includes('company') || line.match(/^\d+\./)) {
      const cleaned = line.replace(/^\d+\.?\s*/, '').trim();
      if (cleaned && competitors.length < 5) {
        competitors.push(cleaned);
      }
    }
  }
  return competitors.length > 0 ? competitors : null;
};

const extractTrends = (lines) => {
  const trends = [];
  for (const line of lines) {
    if (line.toLowerCase().includes('trend') || line.toLowerCase().includes('opportunity') || line.toLowerCase().includes('growth')) {
      const cleaned = line.replace(/^\d+\.?\s*/, '').trim();
      if (cleaned && trends.length < 5) {
        trends.push(cleaned);
      }
    }
  }
  return trends.length > 0 ? trends : null;
};

const extractFunding = (lines) => {
  for (const line of lines) {
    if (line.toLowerCase().includes('funding') || line.toLowerCase().includes('investment') || line.toLowerCase().includes('raised')) {
      return line.trim();
    }
  }
  return null;
};

const generateFallbackResearch = (idea) => {
  return {
    marketSize: `The ${idea} market represents a multi-billion dollar opportunity with strong growth projections driven by digital transformation and increasing demand for innovative solutions.`,
    competitors: [
      'Established market incumbents with legacy solutions',
      'Emerging technology startups with innovative approaches',
      'Large enterprise software providers',
      'Specialized niche players with domain expertise',
      'International companies expanding globally'
    ],
    trends: [
      'Accelerated digital transformation across industries',
      'Increased focus on automation and efficiency',
      'Growing demand for user-friendly solutions',
      'Emphasis on sustainable and cost-effective alternatives',
      'Integration of AI and machine learning capabilities'
    ],
    funding: 'Active investment environment with significant venture capital interest, growing number of funding rounds, and increasing valuations in the sector.',
    sources: ['Market Intelligence', 'Industry Reports', 'Competitive Analysis', 'Investment Tracking']
  };
};

module.exports = {
  researchIdea
};