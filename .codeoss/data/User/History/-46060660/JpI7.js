require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const fetch = require('node-fetch');

app.use(express.json());

// Auth Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authorization token required' });

  try {
    const { user, error } = await supabase.auth.api.getUser(token);
    if (error) throw error;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Research Endpoint
app.post('/api/generate-pitch', authenticate, async (req, res) => {
  try {
    // 1. Market research
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({ query: req.body.idea })
    });
    const firecrawlData = await firecrawlResponse.json();
    
    // 2. Generate pitch content
    const tamboResponse = await fetch('https://api.tambo.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TAMBO_AI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: `Generate startup pitch for: ${req.body.idea}\n\nResearch: ${JSON.stringify(firecrawlData.data?.slice(0,3) || 'No research found'}`,
        max_tokens: 1000
      })
    });
    const tamboData = await tamboResponse.json();
    
    // 3. Save to database
    const { data, error } = await supabase
      .from('projects')
      .upsert([{
        user_id: req.user.id,
        idea: req.body.idea,
        content: tamboData.choices[0].text.trim(),
        research: firecrawlData.data || []
      }]);
    
    if (error) throw error;
    
    res.json({
      projectId: data[0].id,
      pitch: tamboData.choices[0].text.trim(),
      research: firecrawlData.data || []
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PDF Export Endpoint
app.get('/api/export/pdf/:projectId', authenticate, async (req, res) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.projectId)
      .single();
    
    if (error || !project) throw new Error('Project not found');
    
    // Simple PDF generation
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="pitch-${req.params.projectId}.pdf"`);
    doc.pipe(res);
    
    doc.fontSize(20).text(project.idea, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(project.content);
    
    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});