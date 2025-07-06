import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const IdeaForm = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authMode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        alert('Check your email for verification link!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Here you would call your API to generate pitch
      console.log('Idea submitted:', idea);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  };

  const textareaStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    minHeight: '150px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    opacity: loading ? 0.5 : 1,
    width: '100%'
  };

  const linkStyle = {
    color: '#3b82f6',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  if (showAuth && !user) {
    return (
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {authMode === 'signin' ? '🔑 Sign In' : '📝 Sign Up'}
        </h2>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? '⏳ Please wait...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={linkStyle}
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          >
            {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span 
            style={linkStyle}
            onClick={() => setShowAuth(false)}
          >
            ← Back to Idea Form
          </span>
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937', textAlign: 'center' }}>
        🚀 PitchCraft AI
      </h1>
      <p style={{ marginBottom: '2rem', color: '#6b7280', textAlign: 'center' }}>
        Transform your startup idea into a compelling pitch deck
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your startup idea in detail... What problem does it solve? Who is your target market?"
          style={textareaStyle}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          {loading ? '⏳ Generating Pitch...' : '✨ Create Pitch Deck'}
        </button>
      </form>
      
      {user ? (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <p style={{ margin: 0, color: '#059669' }}>
            ✅ Signed in as: {user.email}
          </p>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <p style={{ margin: 0, color: '#dc2626' }}>
            ⚠️ Please <span style={linkStyle} onClick={() => setShowAuth(true)}>sign in</span> to save your pitch deck
          </p>
        </div>
      )}
    </div>
  );
};

export default IdeaForm;