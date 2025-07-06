require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const fetch = require('node-fetch');

// Import routes
const apiRoutes = require('./routes/apiRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    name: 'PitchCraft AI API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api/*'
    },
    message: 'Welcome to PitchCraft AI Backend! No authentication required.'
  });
});

// Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`🚀 PitchCraft AI Backend running on port ${port}`);
  console.log(`📍 API: http://localhost:${port}`);
});