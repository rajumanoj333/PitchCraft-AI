const fetch = require('node-fetch');

const TAMBO_AI_URL = process.env.TAMBO_AI_URL || 'https://api.tambo.ai/v1';
const API_KEY = process.env.TAMBO_AI_API_KEY;

const generatePitchContent = async (idea, researchData = null) => {
  try {
    if (!API_KEY) {
      console.warn('Tambo AI API key not found, using fallback generation');
      return generateFallbackContent(idea);
    }

    const prompt = `Generate a comprehensive startup pitch deck for: "${idea}"

${researchData ? `Market Research Data: ${JSON.stringify(researchData, null, 2)}` : ''}

Create professional content for each slide with specific, detailed information:

1. Executive Summary (2-3 sentences)
2. Problem Statement (specific problems and pain points)
3. Solution (how your product solves the problem)
4. Market Opportunity (market size and potential)
5. Business Model (revenue streams and monetization)
6. Competitive Advantage (unique value proposition)
7. Financial Projections (growth trajectory and metrics)
8. Team (key team members and expertise)
9. Funding Request (investment amount and use of funds)

Make it professional, specific, and investor-ready. Focus on concrete details rather than generic statements.`;

    const response = await fetch(`${TAMBO_AI_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.7,
        model: 'gpt-3.5-turbo'
      })
    });

    if (!response.ok) {
      console.error('Tambo AI API error:', response.status, response.statusText);
      return generateFallbackContent(idea);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.text || data.content || data.text;
    
    if (!generatedText) {
      console.warn('No content generated from Tambo AI, using fallback');
      return generateFallbackContent(idea);
    }

    return parseGeneratedContent(generatedText, idea);

  } catch (error) {
    console.error('Tambo AI service error:', error.message);
    return generateFallbackContent(idea);
  }
};

const parseGeneratedContent = (content, idea) => {
  // Try to parse the AI-generated content into structured slides
  const slides = [];
  const sections = content.split(/\d+\.\s+/).filter(section => section.trim());
  
  const slideTemplates = [
    'Executive Summary',
    'Problem Statement', 
    'Our Solution',
    'Market Opportunity',
    'Business Model',
    'Competitive Advantage',
    'Financial Projections',
    'Team',
    'Funding Request'
  ];

  slideTemplates.forEach((title, index) => {
    const sectionContent = sections[index] || generateFallbackSlide(title, idea);
    slides.push({
      title,
      content: sectionContent.trim()
    });
  });

  return slides;
};

const generateFallbackContent = (idea) => {
  return [
    {
      title: 'Executive Summary',
      content: `${idea} represents a significant market opportunity with our innovative approach to solving key industry challenges. Our solution addresses critical pain points while providing scalable value to customers.`
    },
    {
      title: 'Problem Statement',
      content: `Current solutions in the ${idea} space suffer from inefficiencies, high costs, and poor user experience. Customers struggle with outdated processes and lack of integrated solutions.`
    },
    {
      title: 'Our Solution',
      content: `Our ${idea} platform provides a comprehensive, user-friendly solution that streamlines processes, reduces costs, and improves outcomes through innovative technology and design.`
    },
    {
      title: 'Market Opportunity',
      content: 'The addressable market represents a multi-billion dollar opportunity with strong growth projections. Market trends indicate increasing demand for innovative solutions in this space.'
    },
    {
      title: 'Business Model',
      content: 'We employ a scalable SaaS model with multiple revenue streams including subscriptions, transaction fees, and premium services. Strong unit economics with clear path to profitability.'
    },
    {
      title: 'Competitive Advantage',
      content: 'Our proprietary technology, experienced team, and first-mover advantage in key market segments create sustainable competitive moats. Strong intellectual property and brand recognition.'
    },
    {
      title: 'Financial Projections',
      content: 'Projecting 200% year-over-year growth with positive cash flow by year 3. Strong unit economics with 80%+ gross margins and efficient customer acquisition costs.'
    },
    {
      title: 'Team',
      content: 'Led by experienced entrepreneurs with proven track records in technology and business development. Advisory board includes industry experts and successful founders.'
    },
    {
      title: 'Funding Request',
      content: 'Seeking $2M Series A funding to accelerate product development, expand market reach, and scale operations. Funds will be used for team growth, marketing, and technology infrastructure.'
    }
  ];
};

const generateFallbackSlide = (title, idea) => {
  const templates = {
    'Executive Summary': `${idea} is positioned to capture significant market share through innovative technology and strategic execution.`,
    'Problem Statement': `The ${idea} market faces challenges including inefficiency, high costs, and lack of integration.`,
    'Our Solution': `Our ${idea} solution addresses these challenges through innovative technology and superior user experience.`,
    'Market Opportunity': 'Large and growing market with significant opportunity for disruption and innovation.',
    'Business Model': 'Scalable revenue model with multiple income streams and strong unit economics.',
    'Competitive Advantage': 'Unique technology stack, experienced team, and strategic partnerships create sustainable advantages.',
    'Financial Projections': 'Strong growth trajectory with clear path to profitability and positive unit economics.',
    'Team': 'Experienced leadership team with complementary skills and proven track record of success.',
    'Funding Request': 'Strategic investment to accelerate growth, expand market presence, and scale operations.'
  };
  
  return templates[title] || `Detailed information about ${title.toLowerCase()} for ${idea}.`;
};

module.exports = {
  generatePitchContent
};