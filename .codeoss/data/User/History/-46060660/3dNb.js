require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const fetch = require('node-fetch');

app.use(express.json());

// Improved error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Auth Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token required' });

    const { user, error } = await supabase.auth.api.getUser(token);
    if (error) throw error;
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Research Endpoint
app.post('/api/generate-pitch', authenticate, async (req, res) => {
  try {
    console.log('Received pitch request for:', req.body.idea);
    
    // Firecrawl API call
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({ query: req.body.idea })
    });
    
    if (!firecrawlResponse.ok) {
      throw new Error(`Firecrawl error: ${firecrawlResponse.status}`);
    }
    
    const firecrawlData = await firecrawlResponse.json();
    console.log('Firecrawl results:', firecrawlData.data?.length);
    
    // Tambo AI API call
    const tamboResponse = await fetch('https://api.tambo.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TAMBO_AI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `Generate startup pitch for: ${req.body.idea}`,
        max_tokens: 1000
      })
    });
    
    if (!tamboResponse.ok) {
      throw new Error(`Tambo AI error: ${tamboResponse.status}`);
    }
    
    const tamboData = await tamboResponse.json();
    const pitchContent = tamboData.choices?.[0]?.text?.trim() || 'Content generation failed';
    console.log('Generated pitch content');
    
    // Save to database
    const { data, error } = await supabase
      .from('projects')
      .upsert([{
        user_id: req.user.id,
        idea: req.body.idea,
        content: pitchContent,
        research: firecrawlData.data || []
      }]);
    
    if (error) throw error;
    
    res.json({
      projectId: data[0].id,
      pitch: pitchContent,
      research: firecrawlData.data || []
    });
    
  } catch (error) {
    console.error('Pitch generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('Backend is healthy');
});

// Start server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});