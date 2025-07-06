require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Import AI services
const { generatePitchContent } = require('./services/tamboAIService');
const { researchIdea } = require('./services/firecrawlService');
const { enhanceContent, validatePitchContent, generateExecutiveSummary } = require('./services/googleCloudService');
const { optimizeContent, analyzeLanguage } = require('./services/lingoService');

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'PitchCraft AI API',
    status: 'running',
    message: 'AI-powered pitch deck generator with real-time research and optimization!',
    features: [
      'Market research integration',
      'AI content generation',
      'Content optimization',
      'Language analysis',
      'Professional pitch deck structure'
    ]
  });
});

// Generate comprehensive pitch deck with AI
app.post('/api/generate-pitch', async (req, res) => {
  const startTime = Date.now();
  console.log('📈 Starting pitch generation process...');
  
  try {
    const { idea } = req.body;
    
    if (!idea || !idea.trim()) {
      return res.status(400).json({ 
        error: 'Idea is required',
        message: 'Please provide a detailed description of your startup idea.'
      });
    }

    const cleanIdea = idea.trim();
    console.log(`🚀 Generating pitch for: "${cleanIdea}"`);

    // Step 1: Market Research (parallel with content generation)
    console.log('🔍 Step 1: Conducting market research...');
    const researchPromise = researchIdea(cleanIdea);

    // Step 2: Generate initial pitch content
    console.log('✍️ Step 2: Generating pitch content...');
    const contentPromise = generatePitchContent(cleanIdea);

    // Wait for both research and content generation
    const [researchData, initialSlides] = await Promise.all([
      researchPromise,
      contentPromise
    ]);

    console.log('✅ Research and initial content generation completed');

    // Step 3: Enhance content with research data and AI
    console.log('🎯 Step 3: Enhancing content with research insights...');
    const enhancedSlides = await enhanceContent(initialSlides, cleanIdea);

    // Step 4: Optimize language and readability
    console.log('📝 Step 4: Optimizing language and readability...');
    const optimizedSlides = await optimizeContent(enhancedSlides, cleanIdea);

    // Step 5: Generate executive summary
    console.log('📋 Step 5: Creating executive summary...');
    const executiveSummary = await generateExecutiveSummary(optimizedSlides, cleanIdea);

    // Step 6: Validate and analyze content
    console.log('🔍 Step 6: Validating and analyzing content...');
    const [validation, analysis] = await Promise.all([
      validatePitchContent(optimizedSlides, cleanIdea),
      analyzeLanguage(optimizedSlides)
    ]);

    // Create comprehensive pitch deck
    const pitch = {
      id: Date.now().toString(),
      idea: cleanIdea,
      executiveSummary: executiveSummary,
      slides: optimizedSlides,
      research: {
        marketSize: researchData.marketSize,
        competitors: researchData.competitors,
        trends: researchData.trends,
        funding: researchData.funding,
        sources: researchData.sources
      },
      analysis: {
        language: analysis,
        validation: validation,
        processingTime: Date.now() - startTime
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '2.0',
        aiEnhanced: true,
        researchBacked: true
      }
    };

    console.log(`✅ Pitch generation completed in ${Date.now() - startTime}ms`);
    console.log(`📊 Quality score: ${validation.score || 'N/A'}/10`);

    res.json({
      success: true,
      pitch: pitch,
      message: 'Professional pitch deck generated with AI-powered research and optimization!'
    });

  } catch (error) {
    console.error('❌ Pitch generation error:', error.message);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate pitch deck',
      message: 'An error occurred during AI processing. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get pitch analysis
app.get('/api/analyze/:pitchId', async (req, res) => {
  try {
    const { pitchId } = req.params;
    
    // In a real app, this would fetch from database
    // For now, return analysis structure
    res.json({
      success: true,
      analysis: {
        pitchId: pitchId,
        readabilityScore: 8.5,
        engagementLevel: 'High',
        completeness: 95,
        suggestions: [
          'Consider adding specific market size numbers',
          'Include customer testimonials if available',
          'Add more detailed financial projections'
        ]
      }
    });
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze pitch' });
  }
});

// Health check with service status
app.get('/health', (req, res) => {
  const serviceStatus = {
    tamboAI: !!process.env.TAMBO_AI_API_KEY,
    firecrawl: !!process.env.FIRECRAWL_API_KEY,
    googleCloud: !!process.env.GOOGLE_CLOUD_API_KEY,
    lingoDev: !!process.env.LINGO_DEV_API_KEY
  };
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: serviceStatus,
    version: '2.0.0'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'PitchCraft AI API Documentation',
    version: '2.0.0',
    endpoints: {
      'POST /api/generate-pitch': {
        description: 'Generate AI-powered pitch deck with market research',
        body: { idea: 'string (required) - Your startup idea description' },
        response: 'Complete pitch deck with slides, research, and analysis'
      },
      'GET /api/analyze/:pitchId': {
        description: 'Get detailed analysis of generated pitch',
        response: 'Quality analysis and improvement suggestions'
      },
      'GET /health': {
        description: 'Health check and service status',
        response: 'API status and connected services'
      }
    },
    features: [
      'Real-time market research via Firecrawl',
      'AI content generation via Tambo AI',
      'Content enhancement via Google Cloud AI',
      'Language optimization via Lingo Dev',
      'Professional pitch deck structure',
      'Quality validation and scoring'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong. Please try again.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'Check /api/docs for available endpoints'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 PitchCraft AI Server running on http://localhost:${port}`);
  console.log(`📍 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔧 Health Check: http://localhost:${port}/health`);
  console.log('');
  console.log('🎯 AI Services Integration:');
  console.log(`   Tambo AI: ${process.env.TAMBO_AI_API_KEY ? '✅' : '❌'} Content Generation`);
  console.log(`   Firecrawl: ${process.env.FIRECRAWL_API_KEY ? '✅' : '❌'} Market Research`);
  console.log(`   Google Cloud: ${process.env.GOOGLE_CLOUD_API_KEY ? '✅' : '❌'} Content Enhancement`);
  console.log(`   Lingo Dev: ${process.env.LINGO_DEV_API_KEY ? '✅' : '❌'} Language Optimization`);
  console.log('');
  console.log('🎉 Ready to generate AI-powered pitch decks!');
});

module.exports = app;