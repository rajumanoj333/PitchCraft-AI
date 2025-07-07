const fetch = require('node-fetch');

const GEMINI_URL = process.env.GOOGLE_GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta';
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const enhanceContent = async (slides, idea) => {
  try {
    if (!API_KEY) {
      console.warn('Google Gemini API key not found, using fallback enhancement');
      return enhanceContentFallback(slides, idea);
    }

    const slidesText = slides.map(slide => `${slide.title}: ${slide.content}`).join('\n\n');
    
    const prompt = `Enhance and improve the following pitch deck content for "${idea}":

${slidesText}

Please improve each section by:
1. Making content more specific and data-driven
2. Adding compelling details and metrics where appropriate
3. Improving clarity and investor appeal
4. Maintaining professional tone
5. Ensuring each slide flows logically

Return the enhanced content in the same format with clear section titles.`;

    const response = await fetch(`${GEMINI_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return enhanceContentFallback(slides, idea);
    }

    const data = await response.json();
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!enhancedText) {
      console.warn('No enhanced content from Gemini, using fallback');
      return enhanceContentFallback(slides, idea);
    }

    return parseEnhancedContent(enhancedText, slides);

  } catch (error) {
    console.error('Gemini service error:', error.message);
    return enhanceContentFallback(slides, idea);
  }
};

const validatePitchContent = async (slides, idea) => {
  try {
    if (!API_KEY) {
      return generateFallbackValidation();
    }

    const slidesText = slides.map(slide => `${slide.title}: ${slide.content}`).join('\n\n');
    
    const prompt = `Analyze and score this pitch deck content for "${idea}" (rate 1-10):

${slidesText}

Provide:
1. Overall quality score (1-10)
2. Strengths of the pitch
3. Areas for improvement
4. Investor readiness assessment
5. Specific suggestions for enhancement

Be constructive and specific in your feedback.`;

    const response = await fetch(`${GEMINI_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini validation error:', response.status, response.statusText);
      return generateFallbackValidation();
    }

    const data = await response.json();
    const validationText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!validationText) {
      return generateFallbackValidation();
    }

    return parseValidationResult(validationText);

  } catch (error) {
    console.error('Gemini validation error:', error.message);
    return generateFallbackValidation();
  }
};

const generateExecutiveSummary = async (slides, idea) => {
  try {
    if (!API_KEY) {
      return `${idea} represents a compelling investment opportunity with strong market potential, innovative solutions, and experienced team positioned for sustainable growth and market leadership.`;
    }

    const slidesText = slides.map(slide => `${slide.title}: ${slide.content}`).join('\n\n');
    
    const prompt = `Create a compelling 2-3 sentence executive summary for "${idea}" based on this pitch content:

${slidesText}

The summary should:
1. Capture the essence of the opportunity
2. Highlight key value propositions
3. Appeal to investors
4. Be concise but impactful`;

    const response = await fetch(`${GEMINI_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 300
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini summary error:', response.status, response.statusText);
      return `${idea} represents a compelling investment opportunity with strong market potential and innovative solutions.`;
    }

    const data = await response.json();
    const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return summaryText || `${idea} represents a compelling investment opportunity with strong market potential and innovative solutions.`;

  } catch (error) {
    console.error('Gemini summary error:', error.message);
    return `${idea} represents a compelling investment opportunity with innovative solutions and strong market potential.`;
  }
};

const parseEnhancedContent = (enhancedText, originalSlides) => {
  // Try to parse the enhanced content back into slides
  const sections = enhancedText.split(/(?:^|\n)(?=[A-Z][^:]*:)/);
  const enhancedSlides = [];

  originalSlides.forEach((originalSlide, index) => {
    const matchingSection = sections.find(section => 
      section.toLowerCase().includes(originalSlide.title.toLowerCase())
    );

    if (matchingSection) {
      const content = matchingSection.replace(/^[^:]*:\s*/, '').trim();
      enhancedSlides.push({
        title: originalSlide.title,
        content: content || originalSlide.content
      });
    } else {
      // Keep original if no enhancement found
      enhancedSlides.push(originalSlide);
    }
  });

  return enhancedSlides.length > 0 ? enhancedSlides : originalSlides;
};

const parseValidationResult = (validationText) => {
  const scoreMatch = validationText.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*10|out of 10)/i);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7.5;

  return {
    score: score,
    valid: true,
    feedback: validationText,
    suggestions: extractSuggestions(validationText)
  };
};

const extractSuggestions = (text) => {
  const suggestions = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('suggest') || 
        line.toLowerCase().includes('improve') || 
        line.toLowerCase().includes('consider')) {
      suggestions.push(line.trim());
    }
  }
  
  return suggestions.length > 0 ? suggestions : [
    'Consider adding more specific metrics and data points',
    'Include customer testimonials or case studies if available',
    'Strengthen the competitive analysis section',
    'Add more detailed financial projections'
  ];
};

const enhanceContentFallback = (slides, idea) => {
  return slides.map(slide => ({
    title: slide.title,
    content: slide.content + (slide.content.length < 100 ? 
      ` Our ${idea} solution leverages cutting-edge technology and proven business strategies to deliver exceptional value to customers and stakeholders.` : '')
  }));
};

const generateFallbackValidation = () => {
  return {
    score: 7.5,
    valid: true,
    feedback: 'The pitch deck demonstrates good foundational elements with clear structure and compelling value proposition. Consider adding more specific metrics and market data.',
    suggestions: [
      'Include more specific market size numbers and growth projections',
      'Add customer testimonials or early traction metrics',
      'Strengthen the competitive differentiation section',
      'Provide more detailed financial projections and assumptions'
    ]
  };
};

module.exports = {
  enhanceContent,
  validatePitchContent,
  generateExecutiveSummary
};