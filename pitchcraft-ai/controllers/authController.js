// controllers/authController.js
const { registerUser, loginUser } = require('../services/supabaseService');

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};