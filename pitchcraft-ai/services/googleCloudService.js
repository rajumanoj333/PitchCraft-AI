const fetch = require('node-fetch');

const GOOGLE_CLOUD_URL = process.env.GOOGLE_CLOUD_URL || 'https://generativelanguage.googleapis.com/v1';
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

const enhanceContent = async (slides, idea) => {
  try {
    if (!API_KEY) {
      console.warn('Google Cloud API key not found, returning original content');
      return slides;
    }

    const enhancedSlides = [];
    
    for (const slide of slides) {
      const enhancedSlide = await enhanceSlideContent(slide, idea);
      enhancedSlides.push(enhancedSlide);
    }
    
    return enhancedSlides;

  } catch (error) {
    console.error('Google Cloud enhancement error:', error.message);
    return slides; // Return original slides if enhancement fails
  }
};

const enhanceSlideContent = async (slide, idea) => {
  try {
    const prompt = `Enhance and improve this pitch deck slide content for "${idea}":

Title: ${slide.title}
Current Content: ${slide.content}

Please:
1. Make it more specific and detailed
2. Add concrete numbers or metrics where appropriate
3. Ensure it's professional and investor-ready
4. Keep it concise but informative
5. Focus on value proposition and market opportunity

Enhanced content:`;

    const response = await fetch(`${GOOGLE_CLOUD_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200
        }
      })
    });

    if (!response.ok) {
      console.error('Google Cloud API error:', response.status, response.statusText);
      return slide; // Return original slide
    }

    const data = await response.json();
    const enhancedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (enhancedContent && enhancedContent.trim() && enhancedContent.length > 20) {
      return {
        ...slide,
        content: enhancedContent.trim()
      };
    }
    
    return slide; // Return original if enhancement failed

  } catch (error) {
    console.error(`Error enhancing slide "${slide.title}":`, error.message);
    return slide;
  }
};

const validatePitchContent = async (slides, idea) => {
  try {
    if (!API_KEY) {
      console.warn('Google Cloud API key not found, skipping validation');
      return { valid: true, suggestions: [] };
    }

    const content = slides.map(slide => `${slide.title}: ${slide.content}`).join('\n\n');
    
    const prompt = `Review this pitch deck content for "${idea}" and provide feedback:

${content}

Please provide:
1. Overall quality assessment (1-10)
2. Key strengths
3. Areas for improvement
4. Specific suggestions

Format your response as JSON:
{
  "score": number,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await fetch(`${GOOGLE_CLOUD_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      console.error('Google Cloud validation error:', response.status);
      return { valid: true, suggestions: [] };
    }

    const data = await response.json();
    const validationText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (validationText) {
      try {
        const validation = JSON.parse(validationText);
        return {
          valid: validation.score >= 6,
          score: validation.score,
          strengths: validation.strengths || [],
          improvements: validation.improvements || [],
          suggestions: validation.suggestions || []
        };
      } catch (parseError) {
        console.error('Error parsing validation response:', parseError.message);
      }
    }
    
    return { valid: true, suggestions: [] };

  } catch (error) {
    console.error('Validation error:', error.message);
    return { valid: true, suggestions: [] };
  }
};

const generateExecutiveSummary = async (slides, idea) => {
  try {
    if (!API_KEY) {
      console.warn('Google Cloud API key not found, generating basic summary');
      return `${idea} represents a compelling investment opportunity with strong market potential and innovative solutions.`;
    }

    const content = slides.map(slide => `${slide.title}: ${slide.content}`).join('\n');
    
    const prompt = `Based on this pitch deck content for "${idea}", create a compelling 2-3 sentence executive summary that captures the key value proposition:

${content}

Executive Summary:`;

    const response = await fetch(`${GOOGLE_CLOUD_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
          temperature: 0.8,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 150
        }
      })
    });

    if (!response.ok) {
      console.error('Google Cloud summary error:', response.status);
      return `${idea} represents a compelling investment opportunity with strong market potential and innovative solutions.`;
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return summary?.trim() || `${idea} represents a compelling investment opportunity with strong market potential and innovative solutions.`;

  } catch (error) {
    console.error('Executive summary error:', error.message);
    return `${idea} represents a compelling investment opportunity with strong market potential and innovative solutions.`;
  }
};

module.exports = {
  enhanceContent,
  validatePitchContent,
  generateExecutiveSummary
};