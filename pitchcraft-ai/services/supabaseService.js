// services/supabaseService.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// User registration
const registerUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw new Error(error.message);
  return user;
};

// User login
const loginUser = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password
  });
  
  if (error) throw new Error(error.message);
  return user;
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

module.exports = { registerUser, loginUser, savePitchData };