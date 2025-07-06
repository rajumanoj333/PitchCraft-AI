const { supabase } = require('../services/supabaseService');

exports.generatePitch = async (req, res) => {
  try {
    const { idea, targetLang } = req.body;
    
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    // This would integrate with research and generation services
    // For now, return a basic response structure
    const pitchData = {
      idea,
      content: `Generated pitch content for: ${idea}`,
      research: [],
      targetLang
    };

    // Save to database
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: req.user.id,
        idea: idea,
        content: pitchData.content,
        research: pitchData.research
      }])
      .select();
    
    if (error) throw error;
    
    res.json({
      projectId: data[0].id,
      ...pitchData
    });
    
  } catch (error) {
    console.error('Pitch generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPitch = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', req.user.id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({ error: error.message });
  }
};