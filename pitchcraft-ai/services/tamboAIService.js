// services/tamboAIService.js
const fetch = require('node-fetch');

const generatePitchContent = async (idea, researchData) => {
  const prompt = `
    Generate a startup pitch based on the following idea: ${idea}
    
    Research insights:
    ${JSON.stringify(researchData.slice(0, 3))}
    
    Include these sections:
    1. Problem statement
    2. Solution description
    3. Target market analysis
    4. Business model
    5. Revenue streams
  `;

  try {
    const response = await fetch('https://api.tambo.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TAMBO_AI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error('Tambo AI Error:', error);
    return 'Failed to generate pitch content';
  }
};

module.exports = { generatePitchContent };