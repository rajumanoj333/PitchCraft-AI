import { useState } from 'react';
import axios from 'axios';

const IdeaForm = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/generate-pitch', {
        idea: idea.trim(),
        targetLang: 'English'
      });
      
      setResult(response.data);
      console.log('Generated pitch:', response.data);
    } catch (error) {
      console.error('Error generating pitch:', error);
      setError(error.response?.data?.error || 'Failed to generate pitch deck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setIdea('');
    setError('');
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem'
  };

  const textareaStyle = {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    minHeight: '120px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 32px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s'
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem'
  };

  const resultStyle = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginTop: '1rem'
  };

  const sectionStyle = {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0'
  };

  if (result) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: '#1f2937', margin: 0 }}>
              🎯 Your Pitch Deck
            </h1>
            <button 
              onClick={handleReset}
              style={{
                ...buttonStyle,
                backgroundColor: '#6b7280',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              Create Another Pitch
            </button>
          </div>

          <div style={resultStyle}>
            <div style={sectionStyle}>
              <h3 style={{ color: '#3b82f6', marginTop: 0 }}>💡 Original Idea</h3>
              <p style={{ marginBottom: 0, fontSize: '16px' }}>{result.pitch.idea}</p>
            </div>

            {result.pitch.content && typeof result.pitch.content === 'object' ? (
              Object.entries(result.pitch.content).map(([key, value]) => (
                <div key={key} style={sectionStyle}>
                  <h3 style={{ color: '#3b82f6', marginTop: 0, textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <p style={{ marginBottom: 0, lineHeight: '1.6' }}>{value}</p>
                </div>
              ))
            ) : (
              <div style={sectionStyle}>
                <h3 style={{ color: '#3b82f6', marginTop: 0 }}>Pitch Content</h3>
                <p style={{ marginBottom: 0, lineHeight: '1.6' }}>{result.pitch.content}</p>
              </div>
            )}

            <div style={{ marginTop: '2rem', fontSize: '14px', color: '#6b7280' }}>
              Generated on: {new Date(result.pitch.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', color: '#1f2937', marginBottom: '0.5rem' }}>
            🚀 PitchCraft AI
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
            Transform your startup idea into a compelling pitch deck
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Describe Your Startup Idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Tell us about your startup idea... What problem does it solve? Who is your target market? What makes it unique?"
              style={textareaStyle}
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !idea.trim()}
            style={buttonStyle}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {loading ? '⏳ Generating Your Pitch Deck...' : '✨ Generate Pitch Deck'}
          </button>
        </form>
        
        {error && (
          <div style={errorStyle}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaForm;