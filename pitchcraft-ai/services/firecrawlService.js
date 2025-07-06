const fetch = require('node-fetch');

const FIRECRAWL_URL = process.env.FIRECRAWL_URL || 'https://api.firecrawl.dev/v0';
const API_KEY = process.env.FIRECRAWL_API_KEY;

const researchIdea = async (idea) => {
  try {
    if (!API_KEY) {
      console.warn('Firecrawl API key not found, using fallback research');
      return generateFallbackResearch(idea);
    }

    // Search for market information
    const searchQueries = [
      `${idea} market size trends 2024`,
      `${idea} competitors analysis`,
      `${idea} industry report statistics`,
      `${idea} startup funding investors`
    ];

    const researchPromises = searchQueries.map(query => searchMarketData(query));
    const results = await Promise.allSettled(researchPromises);
    
    const successfulResults = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    if (successfulResults.length === 0) {
      console.warn('No research data found, using fallback');
      return generateFallbackResearch(idea);
    }

    return {
      marketSize: extractMarketSize(successfulResults),
      competitors: extractCompetitors(successfulResults),
      trends: extractTrends(successfulResults),
      funding: extractFundingInfo(successfulResults),
      sources: successfulResults.map(r => r.url).filter(Boolean)
    };

  } catch (error) {
    console.error('Firecrawl research error:', error.message);
    return generateFallbackResearch(idea);
  }
};

const searchMarketData = async (query) => {
  try {
    const response = await fetch(`${FIRECRAWL_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        query: query,
        pageOptions: {
          onlyMainContent: true
        },
        limit: 5
      })
    });

    if (!response.ok) {
      console.error(`Firecrawl search error for "${query}":`, response.status);
      return null;
    }

    const data = await response.json();
    return data.data?.[0]; // Return first result

  } catch (error) {
    console.error(`Search error for "${query}":`, error.message);
    return null;
  }
};

const extractMarketSize = (results) => {
  // Look for market size indicators in the research data
  const marketKeywords = ['billion', 'million', 'market size', 'valuation', 'revenue'];
  
  for (const result of results) {
    const content = result.content || result.text || '';
    const lowerContent = content.toLowerCase();
    
    if (marketKeywords.some(keyword => lowerContent.includes(keyword))) {
      // Extract relevant market size information
      const sentences = content.split('.').filter(sentence => 
        marketKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
      );
      
      if (sentences.length > 0) {
        return sentences[0].trim() + '.';
      }
    }
  }
  
  return 'Large and growing market with significant opportunity for expansion.';
};

const extractCompetitors = (results) => {
  // Look for competitor mentions
  const competitors = [];
  const competitorKeywords = ['competitor', 'rival', 'alternative', 'similar', 'leading company'];
  
  for (const result of results) {
    const content = result.content || result.text || '';
    const lowerContent = content.toLowerCase();
    
    if (competitorKeywords.some(keyword => lowerContent.includes(keyword))) {
      // Extract company names (simplified approach)
      const sentences = content.split('.').filter(sentence => 
        competitorKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
      );
      
      competitors.push(...sentences.slice(0, 2));
    }
  }
  
  return competitors.length > 0 ? competitors : [
    'Established players with traditional approaches',
    'Emerging startups with innovative solutions',
    'Large enterprises with comprehensive platforms'
  ];
};

const extractTrends = (results) => {
  const trendKeywords = ['trend', 'growth', 'increasing', 'rising', 'adoption', 'emerging'];
  const trends = [];
  
  for (const result of results) {
    const content = result.content || result.text || '';
    const lowerContent = content.toLowerCase();
    
    if (trendKeywords.some(keyword => lowerContent.includes(keyword))) {
      const sentences = content.split('.').filter(sentence => 
        trendKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
      );
      
      trends.push(...sentences.slice(0, 2));
    }
  }
  
  return trends.length > 0 ? trends : [
    'Digital transformation driving market growth',
    'Increasing demand for innovative solutions',
    'Growing adoption of technology-based approaches'
  ];
};

const extractFundingInfo = (results) => {
  const fundingKeywords = ['funding', 'investment', 'raised', 'venture', 'series', 'capital'];
  const fundingInfo = [];
  
  for (const result of results) {
    const content = result.content || result.text || '';
    const lowerContent = content.toLowerCase();
    
    if (fundingKeywords.some(keyword => lowerContent.includes(keyword))) {
      const sentences = content.split('.').filter(sentence => 
        fundingKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
      );
      
      fundingInfo.push(...sentences.slice(0, 2));
    }
  }
  
  return fundingInfo.length > 0 ? fundingInfo : [
    'Active investor interest in the sector',
    'Multiple funding rounds completed by similar companies',
    'Growing venture capital investment in the space'
  ];
};

const generateFallbackResearch = (idea) => {
  return {
    marketSize: `The ${idea} market represents a significant opportunity with strong growth potential and increasing demand.`,
    competitors: [
      'Established market leaders with traditional approaches',
      'Innovative startups with technology-focused solutions',
      'Large enterprises with comprehensive service offerings'
    ],
    trends: [
      'Growing adoption of digital solutions',
      'Increasing market demand and customer awareness',
      'Technology-driven transformation in the industry'
    ],
    funding: [
      'Active venture capital interest in the sector',
      'Multiple successful funding rounds by competitors',
      'Growing investor confidence in market potential'
    ],
    sources: []
  };
};

module.exports = {
  researchIdea
};