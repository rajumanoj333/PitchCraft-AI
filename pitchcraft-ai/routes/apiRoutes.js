// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const { researchAndGenerate } = require('../controllers/researchController');
const { generatePitch, getPitch } = require('../controllers/pitchController');

// Public API routes - no authentication required
router.post('/generate-pitch', researchAndGenerate);
router.post('/pitch', generatePitch);
router.get('/pitch/:projectId', getPitch);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router;