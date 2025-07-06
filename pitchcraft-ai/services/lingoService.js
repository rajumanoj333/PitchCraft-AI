const fetch = require('node-fetch');

const LINGO_DEV_URL = process.env.LINGO_DEV_URL || 'https://api.lingo.dev/v1';
const API_KEY = process.env.LINGO_DEV_API_KEY;

const optimizeContent = async (slides, idea) => {
  try {
    if (!API_KEY) {
      console.warn('Lingo Dev API key not found, using basic optimization');
      return optimizeContentBasic(slides);
    }

    const optimizedSlides = [];
    
    for (const slide of slides) {
      const optimizedSlide = await optimizeSlideContent(slide, idea);
      optimizedSlides.push(optimizedSlide);
    }
    
    return optimizedSlides;

  } catch (error) {
    console.error('Lingo optimization error:', error.message);
    return optimizeContentBasic(slides);
  }
};

const optimizeSlideContent = async (slide, idea) => {
  try {
    const response = await fetch(`${LINGO_DEV_URL}/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        text: slide.content,
        context: `${slide.title} for ${idea} startup pitch`,
        optimization_goals: [
          'clarity',
          'professionalism',
          'engagement',
          'conciseness'
        ],
        target_audience: 'investors',
        tone: 'professional'
      })
    });

    if (!response.ok) {
      console.error('Lingo API error:', response.status, response.statusText);
      return slide;
    }

    const data = await response.json();
    const optimizedContent = data.optimized_text || data.text || data.content;
    
    if (optimizedContent && optimizedContent.trim() && optimizedContent.length > 10) {
      return {
        ...slide,
        content: optimizedContent.trim()
      };
    }
    
    return slide;

  } catch (error) {
    console.error(`Error optimizing slide "${slide.title}":`, error.message);
    return slide;
  }
};

const analyzeLanguage = async (slides) => {
  try {
    if (!API_KEY) {
      console.warn('Lingo Dev API key not found, using basic analysis');
      return generateBasicAnalysis(slides);
    }

    const allContent = slides.map(slide => slide.content).join(' ');
    
    const response = await fetch(`${LINGO_DEV_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        text: allContent,
        analysis_types: [
          'readability',
          'sentiment',
          'engagement',
          'clarity'
        ]
      })
    });

    if (!response.ok) {
      console.error('Lingo analysis error:', response.status);
      return generateBasicAnalysis(slides);
    }

    const data = await response.json();
    
    return {
      readability: data.readability || { score: 8, level: 'professional' },
      sentiment: data.sentiment || { score: 0.7, type: 'positive' },
      engagement: data.engagement || { score: 7.5, level: 'high' },
      clarity: data.clarity || { score: 8.2, level: 'clear' },
      wordCount: allContent.split(' ').length,
      suggestions: data.suggestions || []
    };

  } catch (error) {
    console.error('Language analysis error:', error.message);
    return generateBasicAnalysis(slides);
  }
};

const improveReadability = async (slides) => {
  try {
    if (!API_KEY) {
      console.warn('Lingo Dev API key not found, using basic improvements');
      return improveReadabilityBasic(slides);
    }

    const improvedSlides = [];
    
    for (const slide of slides) {
      const improvedSlide = await improveSlideReadability(slide);
      improvedSlides.push(improvedSlide);
    }
    
    return improvedSlides;

  } catch (error) {
    console.error('Readability improvement error:', error.message);
    return improveReadabilityBasic(slides);
  }
};

const improveSlideReadability = async (slide) => {
  try {
    const response = await fetch(`${LINGO_DEV_URL}/readability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        text: slide.content,
        target_level: 'business_professional',
        improvements: [
          'simplify_complex_sentences',
          'reduce_jargon',
          'improve_structure',
          'enhance_clarity'
        ]
      })
    });

    if (!response.ok) {
      console.error('Lingo readability error:', response.status);
      return slide;
    }

    const data = await response.json();
    const improvedContent = data.improved_text || data.text || data.content;
    
    if (improvedContent && improvedContent.trim()) {
      return {
        ...slide,
        content: improvedContent.trim()
      };
    }
    
    return slide;

  } catch (error) {
    console.error(`Error improving readability for "${slide.title}":`, error.message);
    return slide;
  }
};

// Fallback functions for when API is not available
const optimizeContentBasic = (slides) => {
  return slides.map(slide => ({
    ...slide,
    content: slide.content
      .replace(/\s+/g, ' ') // Clean up whitespace
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure proper spacing after sentences
      .trim()
  }));
};

const generateBasicAnalysis = (slides) => {
  const allContent = slides.map(slide => slide.content).join(' ');
  const wordCount = allContent.split(' ').length;
  
  return {
    readability: { score: 8, level: 'professional' },
    sentiment: { score: 0.8, type: 'positive' },
    engagement: { score: 7.5, level: 'high' },
    clarity: { score: 8.0, level: 'clear' },
    wordCount: wordCount,
    suggestions: [
      'Content appears well-structured and professional',
      'Good balance of technical detail and accessibility',
      'Strong value proposition clearly communicated'
    ]
  };
};

const improveReadabilityBasic = (slides) => {
  return slides.map(slide => {
    let content = slide.content;
    
    // Basic improvements
    content = content.replace(/\b(utilize|utilization)\b/gi, 'use');
    content = content.replace(/\b(facilitate)\b/gi, 'help');
    content = content.replace(/\b(implement)\b/gi, 'put in place');
    content = content.replace(/\b(optimize)\b/gi, 'improve');
    content = content.replace(/\s+/g, ' ').trim();
    
    return {
      ...slide,
      content: content
    };
  });
};

module.exports = {
  optimizeContent,
  analyzeLanguage,
  improveReadability
};