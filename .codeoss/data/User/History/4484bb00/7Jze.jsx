// src/components/IdeaForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { generatePitch } from '../services/apiService';

const IdeaForm = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = user ? user.access_token : await registerAndGetToken();
      const response = await generatePitch(idea, token);
      navigate(`/editor/${response.projectId}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerAndGetToken = async () => {
    // Auto-register user with temp credentials
    const email = `temp-${Date.now()}@pitchcraft.ai`;
    const password = Math.random().toString(36).slice(2);
    await signUp(email, password);
    const { user } = await signIn(email, password);
    return user.access_token;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">PitchCraft AI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your startup idea..."
          className="w-full p-4 border rounded-lg min-h-[150px]"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating Pitch...' : 'Create Pitch Deck'}
        </button>
      </form>
    </div>
  );
};

export default IdeaForm;