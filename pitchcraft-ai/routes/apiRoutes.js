// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const { researchAndGenerate } = require('../controllers/researchController');
const { generatePitch, getPitch } = require('../controllers/pitchController');
const authenticate = require('../middleware/authMiddleware');

// Protect all API routes
router.use(authenticate);

// Pitch generation routes
router.post('/generate-pitch', researchAndGenerate);
router.post('/pitch', generatePitch);
router.get('/pitch/:projectId', getPitch);

module.exports = router;