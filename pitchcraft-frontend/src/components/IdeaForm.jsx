import { useState } from 'react';
import axios from 'axios';

const IdeaForm = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/generate-pitch', {
        idea: idea.trim()
      });
      
      setPitch(response.data.pitch);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate pitch deck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPitch(null);
    setIdea('');
    setError('');
  };

  if (pitch) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '2rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#1f2937', margin: 0 }}>
              🎯 Your Pitch Deck
            </h1>
            <button 
              onClick={handleReset}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Create New Pitch
            </button>
          </div>

          {/* Original Idea */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
            <h3 style={{ color: '#3b82f6', marginTop: 0, fontSize: '1.2rem' }}>💡 Original Idea</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{pitch.idea}</p>
          </div>

          {/* Pitch Slides */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {pitch.slides.map((slide, index) => (
              <div 
                key={index}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3b82f6'
                }}
              >
                <h3 style={{ 
                  color: '#1f2937', 
                  marginTop: 0, 
                  marginBottom: '1rem',
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>
                  {index + 1}. {slide.title}
                </h3>
                <p style={{ 
                  lineHeight: '1.7', 
                  margin: 0, 
                  color: '#4b5563',
                  fontSize: '15px'
                }}>
                  {slide.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#6b7280',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '1rem'
          }}>
            Generated on: {new Date(pitch.generatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '3rem'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🚀 PitchCraft AI
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            margin: 0,
            lineHeight: '1.6'
          }}>
            Transform your startup idea into a professional pitch deck instantly
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#374151',
              fontSize: '16px'
            }}>
              Describe Your Startup Idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your startup idea here... What problem does it solve? Who is your target market? What makes it unique?"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                minHeight: '120px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !idea.trim()}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '15px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!loading && idea.trim()) {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && idea.trim()) {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? '⏳ Generating Your Pitch Deck...' : '✨ Generate Pitch Deck'}
          </button>
        </form>
        
        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626'
          }}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaForm;