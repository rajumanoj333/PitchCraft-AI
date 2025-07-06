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
      
      if (response.data.success) {
        setPitch(response.data.pitch);
        console.log('Generated pitch:', response.data);
      } else {
        setError('Failed to generate pitch deck. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to generate pitch deck. Please try again.';
      setError(errorMessage);
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '2rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#1f2937', margin: 0 }}>
                🎯 AI-Powered Pitch Deck
              </h1>
              {pitch.analysis?.validation?.score && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Quality Score: </span>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: pitch.analysis.validation.score >= 8 ? '#059669' : pitch.analysis.validation.score >= 6 ? '#d97706' : '#dc2626',
                    marginLeft: '0.5rem'
                  }}>
                    {pitch.analysis.validation.score}/10
                  </span>
                </div>
              )}
            </div>
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

          {/* Original Idea & Executive Summary */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px solid #e2e8f0', marginBottom: '1rem' }}>
              <h3 style={{ color: '#3b82f6', marginTop: 0, fontSize: '1.2rem' }}>💡 Original Idea</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{pitch.idea}</p>
            </div>
            
            {pitch.executiveSummary && (
              <div style={{ padding: '1.5rem', backgroundColor: '#fef3f4', borderRadius: '8px', border: '2px solid #fecaca' }}>
                <h3 style={{ color: '#dc2626', marginTop: 0, fontSize: '1.2rem' }}>📋 Executive Summary</h3>
                <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{pitch.executiveSummary}</p>
              </div>
            )}
          </div>

          {/* Pitch Slides */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '1.5rem' }}>📊 Pitch Deck Slides</h2>
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
          </div>

          {/* Market Research */}
          {pitch.research && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '1.5rem' }}>🔍 Market Research</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                
                {/* Market Size */}
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                  <h4 style={{ color: '#0369a1', margin: '0 0 0.5rem 0' }}>📈 Market Size</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#075985' }}>{pitch.research.marketSize}</p>
                </div>

                {/* Competitors */}
                {pitch.research.competitors && pitch.research.competitors.length > 0 && (
                  <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                    <h4 style={{ color: '#92400e', margin: '0 0 0.5rem 0' }}>🏢 Competitive Landscape</h4>
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '14px', color: '#a16207' }}>
                      {pitch.research.competitors.slice(0, 3).map((competitor, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>{competitor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Trends */}
                {pitch.research.trends && pitch.research.trends.length > 0 && (
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <h4 style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>📊 Market Trends</h4>
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '14px', color: '#15803d' }}>
                      {pitch.research.trends.slice(0, 3).map((trend, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>{trend}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Analysis & Insights */}
          {pitch.analysis && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '1.5rem' }}>📊 AI Analysis</h2>
              
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                
                {/* Language Analysis */}
                {pitch.analysis.language && (
                  <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                    <h4 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>📝 Content Quality</h4>
                    <div style={{ fontSize: '12px', color: '#6b46c1' }}>
                      <div>Readability: {pitch.analysis.language.readability?.score}/10</div>
                      <div>Engagement: {pitch.analysis.language.engagement?.score}/10</div>
                      <div>Word Count: {pitch.analysis.language.wordCount}</div>
                    </div>
                  </div>
                )}

                {/* Processing Time */}
                {pitch.analysis.processingTime && (
                  <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <h4 style={{ color: '#475569', margin: '0 0 0.5rem 0' }}>⚡ Generation Speed</h4>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Processed in {(pitch.analysis.processingTime / 1000).toFixed(1)}s
                    </div>
                  </div>
                )}

                {/* AI Enhancement */}
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                  <h4 style={{ color: '#0369a1', margin: '0 0 0.5rem 0' }}>🤖 AI Enhanced</h4>
                  <div style={{ fontSize: '12px', color: '#075985' }}>
                    <div>✅ Research-backed</div>
                    <div>✅ Content optimized</div>
                    <div>✅ Language enhanced</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#6b7280',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '1rem'
          }}>
            <div>Generated on: {new Date(pitch.metadata?.generatedAt || Date.now()).toLocaleString()}</div>
            <div style={{ marginTop: '0.5rem' }}>
              Powered by AI • Market Research • Content Optimization
            </div>
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
            AI-powered pitch deck generator with real-time market research
          </p>
          <div style={{ 
            marginTop: '1rem',
            fontSize: '14px',
            color: '#9ca3af'
          }}>
            ✨ Research-backed • 🎯 AI-optimized • 📊 Professional quality
          </div>
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
              placeholder="Enter your startup idea here... What problem does it solve? Who is your target market? What makes it unique? The more details you provide, the better the AI-generated pitch deck will be."
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                minHeight: '140px',
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
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.5rem' }}>
              Pro tip: Include target market, problem solved, and unique value proposition for best results
            </div>
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
            {loading ? '🔄 Generating AI-Powered Pitch Deck...' : '✨ Generate AI Pitch Deck'}
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

        {/* Loading State */}
        {loading && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            color: '#0369a1',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>🤖 AI is working on your pitch deck...</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              • Conducting market research<br/>
              • Generating professional content<br/>
              • Optimizing language and structure
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaForm;