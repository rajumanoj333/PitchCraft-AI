const fetch = require('node-fetch');

const OPENAI_URL = process.env.OPENAI_URL || 'https://api.openai.com/v1';
const API_KEY = process.env.OPENAI_API_KEY;

const generatePitchContent = async (idea, researchData = null) => {
  try {
    if (!API_KEY) {
      console.warn('OpenAI API key not found, using fallback generation');
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

    const response = await fetch(`${OPENAI_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional business consultant specializing in startup pitch decks. Generate detailed, specific, and investor-ready content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return generateFallbackContent(idea);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      console.warn('No content generated from OpenAI, using fallback');
      return generateFallbackContent(idea);
    }

    return parseGeneratedContent(generatedText, idea);

  } catch (error) {
    console.error('OpenAI service error:', error.message);
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
      content: sectionContent.trim().replace(/^\w+\s+\w+:?\s*/, '') // Remove title repetition
    });
  });

  return slides;
};

const generateFallbackContent = (idea) => {
  return [
    {
      title: 'Executive Summary',
      content: `${idea} represents a significant market opportunity with our innovative approach to solving key industry challenges. Our solution addresses critical pain points while providing scalable value to customers and sustainable competitive advantages.`
    },
    {
      title: 'Problem Statement',
      content: `Current solutions in the ${idea} space suffer from inefficiencies, high costs, and poor user experience. Customers struggle with outdated processes, lack of integration, and limited scalability that prevent them from achieving their goals effectively.`
    },
    {
      title: 'Our Solution',
      content: `Our ${idea} platform provides a comprehensive, user-friendly solution that streamlines processes, reduces costs, and improves outcomes through innovative technology, superior user experience, and seamless integration capabilities.`
    },
    {
      title: 'Market Opportunity',
      content: 'The addressable market represents a multi-billion dollar opportunity with strong growth projections. Market trends indicate increasing demand for innovative solutions, digital transformation, and improved efficiency across industries.'
    },
    {
      title: 'Business Model',
      content: 'We employ a scalable SaaS model with multiple revenue streams including subscriptions, transaction fees, and premium services. Strong unit economics with clear path to profitability and sustainable growth.'
    },
    {
      title: 'Competitive Advantage',
      content: 'Our proprietary technology, experienced team, and first-mover advantage in key market segments create sustainable competitive moats. Strong intellectual property, brand recognition, and strategic partnerships.'
    },
    {
      title: 'Financial Projections',
      content: 'Projecting 200% year-over-year growth with positive cash flow by year 3. Strong unit economics with 80%+ gross margins, efficient customer acquisition costs, and expanding market opportunities.'
    },
    {
      title: 'Team',
      content: 'Led by experienced entrepreneurs with proven track records in technology, business development, and market execution. Advisory board includes industry experts, successful founders, and strategic partners.'
    },
    {
      title: 'Funding Request',
      content: 'Seeking $2M Series A funding to accelerate product development, expand market reach, and scale operations. Funds will be used for team growth, marketing, technology infrastructure, and market expansion.'
    }
  ];
};

const generateFallbackSlide = (title, idea) => {
  const templates = {
    'Executive Summary': `${idea} is positioned to capture significant market share through innovative technology, superior user experience, and strategic execution that addresses key market needs.`,
    'Problem Statement': `The ${idea} market faces challenges including inefficiency, high costs, poor user experience, and lack of integration that create significant opportunities for disruption.`,
    'Our Solution': `Our ${idea} solution addresses these challenges through innovative technology, intuitive design, and superior user experience that delivers measurable value to customers.`,
    'Market Opportunity': 'Large and growing market with significant opportunity for disruption, innovation, and value creation through technology-driven solutions.',
    'Business Model': 'Scalable revenue model with multiple income streams, strong unit economics, and clear path to profitability through efficient operations.',
    'Competitive Advantage': 'Unique technology stack, experienced team, strategic partnerships, and first-mover advantages create sustainable competitive benefits.',
    'Financial Projections': 'Strong growth trajectory with positive unit economics, clear path to profitability, and significant market opportunity for expansion.',
    'Team': 'Experienced leadership team with complementary skills, proven track record of success, and deep industry expertise and connections.',
    'Funding Request': 'Strategic investment to accelerate growth, expand market presence, scale operations, and capture maximum market opportunity.'
  };
  
  return templates[title] || `Professional content for ${title.toLowerCase()} highlighting the value proposition and strategic importance of ${idea}.`;
};

module.exports = {
  generatePitchContent
};