// src/components/ExportOptions.jsx
import { useState } from 'react';
import { exportPDF, sendEmail, generateVideo } from '../services/apiService';

const ExportOptions = ({ projectId }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState('');
  
  const handleExport = async (type) => {
    setLoading(type);
    
    try {
      switch(type) {
        case 'pdf': {
          const pdfBlob = await exportPDF(projectId);
          downloadFile(pdfBlob, 'pitch-deck.pdf');
          break;
        }
          
        case 'email': {
          await sendEmail(projectId, email);
          alert('Pitch deck sent successfully!');
          break;
        }
          
        case 'video': {
          const videoBlob = await generateVideo(projectId);
          downloadFile(videoBlob, 'pitch-video.mp4');
          break;
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed');
    } finally {
      setLoading('');
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const containerStyle = {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const buttonStyle = {
    width: '100%',
    marginBottom: '0.5rem',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const pdfButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#059669',
    color: 'white'
  };

  const emailButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#7c3aed',
    color: 'white',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: 'auto',
    paddingLeft: '16px',
    paddingRight: '16px',
    marginBottom: 0
  };

  const videoButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc2626',
    color: 'white',
    marginTop: '1rem'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRight: 'none',
    borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Export Options</h3>
      
      <button
        onClick={() => handleExport('pdf')}
        disabled={loading === 'pdf'}
        style={{
          ...pdfButtonStyle,
          opacity: loading === 'pdf' ? 0.5 : 1,
          backgroundColor: loading === 'pdf' ? '#059669' : '#059669'
        }}
        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#047857')}
        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
      >
        {loading === 'pdf' ? 'Generating...' : 'Export PDF'}
      </button>
      
      <div style={{ display: 'flex', marginTop: '1rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Investor email"
          style={inputStyle}
          required
        />
        <button
          onClick={() => handleExport('email')}
          disabled={loading === 'email' || !email}
          style={{
            ...emailButtonStyle,
            opacity: (loading === 'email' || !email) ? 0.5 : 1
          }}
          onMouseOver={(e) => !loading && email && (e.target.style.backgroundColor = '#6d28d9')}
          onMouseOut={(e) => !loading && email && (e.target.style.backgroundColor = '#7c3aed')}
        >
          {loading === 'email' ? 'Sending...' : 'Email'}
        </button>
      </div>
      
      <button
        onClick={() => handleExport('video')}
        disabled={loading === 'video'}
        style={{
          ...videoButtonStyle,
          opacity: loading === 'video' ? 0.5 : 1
        }}
        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#b91c1c')}
        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#dc2626')}
      >
        {loading === 'video' ? 'Generating...' : 'Create Video Pitch'}
      </button>
    </div>
  );
};

export default ExportOptions;