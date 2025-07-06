const fetch = require('node-fetch');

exports.generatePitch = async (req, res) => {
  try {
    const { idea, targetLang = 'English' } = req.body;
    
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    console.log('Generating pitch for idea:', idea);

    // Generate a sample pitch (in production, this would call AI APIs)
    const pitchData = {
      id: Date.now().toString(),
      idea,
      content: {
        title: `${idea} - Revolutionary Startup`,
        problem: `Addressing key challenges in ${idea} space`,
        solution: `Our innovative approach to ${idea} will transform the market`,
        market: 'Large and growing market opportunity',
        team: 'Experienced team with domain expertise',
        business_model: 'Scalable revenue streams',
        financial_projections: 'Strong growth potential',
        funding_ask: 'Strategic investment for rapid scaling'
      },
      targetLang,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      projectId: pitchData.id,
      pitch: pitchData
    });
    
  } catch (error) {
    console.error('Pitch generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate pitch',
      details: error.message 
    });
  }
};

exports.getPitch = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // In a real app, this would fetch from database
    // For now, return a sample response
    res.json({
      success: true,
      projectId,
      pitch: {
        id: projectId,
        content: 'Sample pitch content',
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({ error: 'Failed to retrieve pitch' });
  }
};