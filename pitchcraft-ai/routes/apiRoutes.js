// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const { researchAndGenerate } = require('../controllers/researchController');
const authenticate = require('../middleware/authMiddleware'); // Create simple auth middleware

// Protect all API routes
router.use(authenticate);

router.post('/generate-pitch', researchAndGenerate);

module.exports = router;