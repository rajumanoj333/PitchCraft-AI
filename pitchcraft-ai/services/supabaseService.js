// services/supabaseService.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// User registration
const registerUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw new Error(error.message);
  return data.user;
};

// User login
const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw new Error(error.message);
  return data.user;
};

// Save pitch data
const savePitchData = async (userId, pitchData) => {
  const { data, error } = await supabase
    .from('projects')
    .upsert([
      { 
        user_id: userId, 
        pitch_data: pitchData,
        created_at: new Date()
      }
    ]);
    
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { supabase, registerUser, loginUser, savePitchData };