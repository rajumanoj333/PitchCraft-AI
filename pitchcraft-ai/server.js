const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'PitchCraft AI API',
    status: 'running',
    message: 'Simple pitch deck generator - no authentication required!'
  });
});

// Generate pitch endpoint
app.post('/api/generate-pitch', (req, res) => {
  const { idea } = req.body;
  
  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  // Generate a simple pitch deck structure
  const pitch = {
    id: Date.now().toString(),
    idea: idea.trim(),
    slides: [
      {
        title: 'Executive Summary',
        content: `${idea} - A revolutionary startup opportunity that addresses key market needs with innovative solutions.`
      },
      {
        title: 'Problem Statement',
        content: `Current solutions in the ${idea} space are inadequate and fail to serve users effectively.`
      },
      {
        title: 'Our Solution',
        content: `Our ${idea} platform provides a comprehensive, user-friendly solution that eliminates existing pain points.`
      },
      {
        title: 'Market Opportunity',
        content: 'Large and growing market with significant opportunity for disruption and innovation.'
      },
      {
        title: 'Business Model',
        content: 'Scalable revenue model with multiple income streams and clear path to profitability.'
      },
      {
        title: 'Competitive Advantage',
        content: 'Unique technology, experienced team, and strong market positioning create sustainable advantages.'
      },
      {
        title: 'Financial Projections',
        content: 'Strong growth trajectory with healthy unit economics and clear path to scale.'
      },
      {
        title: 'Team',
        content: 'Experienced leadership team with proven track record in building successful companies.'
      },
      {
        title: 'Funding Request',
        content: 'Seeking strategic investment to accelerate growth and market expansion.'
      }
    ],
    generatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    pitch: pitch
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 PitchCraft AI Server running on http://localhost:${port}`);
  console.log(`📍 API ready at http://localhost:${port}/api/generate-pitch`);
});

module.exports = app;