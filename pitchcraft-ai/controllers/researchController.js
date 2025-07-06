// controllers/researchController.js
const { researchIdea } = require('../services/firecrawlService');
const { generatePitchContent } = require('../services/tamboAIService');
const { localizeContent } = require('../services/lingoService');
const { savePitchData } = require('../services/supabaseService');

exports.researchAndGenerate = async (req, res) => {
  try {
    // 1. Market research
    const researchData = await researchIdea(req.body.idea);
    
    // 2. Generate pitch content
    const pitchContent = await generatePitchContent(req.body.idea, researchData);
    
    // 3. Localization (optional)
    let localizedContent;
    if (req.body.targetLang) {
      localizedContent = await localizeContent(pitchContent, req.body.targetLang);
    }
    
    // 4. Save to database
    await savePitchData(req.user.id, {
      idea: req.body.idea,
      content: pitchContent,
      localized: localizedContent,
      research: researchData
    });
    
    res.json({
      research: researchData,
      pitch: pitchContent,
      localized: localizedContent
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};