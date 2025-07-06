// src/components/ExportOptions.jsx
import { useState } from 'react';
import { exportPDF, sendEmail, generateVideo } from '../services/apiService';

const ExportOptions = ({ projectId, token }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState('');
  
  const handleExport = async (type) => {
    setLoading(type);
    
    try {
      switch(type) {
        case 'pdf':
          const pdfBlob = await exportPDF(projectId, token);
          downloadFile(pdfBlob, 'pitch-deck.pdf');
          break;
          
        case 'email':
          await sendEmail(projectId, email, token);
          alert('Pitch deck sent successfully!');
          break;
          
        case 'video':
          const videoBlob = await generateVideo(projectId, token);
          downloadFile(videoBlob, 'pitch-video.mp4');
          break;
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

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold mb-3">Export Options</h3>
      
      <button
        onClick={() => handleExport('pdf')}
        disabled={loading === 'pdf'}
        className="w-full mb-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading === 'pdf' ? 'Generating...' : 'Export PDF'}
      </button>
      
      <div className="flex mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Investor email"
          className="flex-1 p-2 border rounded-l"
          required
        />
        <button
          onClick={() => handleExport('email')}
          disabled={loading === 'email' || !email}
          className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700 disabled:opacity-50"
        >
          {loading === 'email' ? 'Sending...' : 'Email'}
        </button>
      </div>
      
      <button
        onClick={() => handleExport('video')}
        disabled={loading === 'video'}
        className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading === 'video' ? 'Generating...' : 'Create Video Pitch'}
      </button>
    </div>
  );
};

export default ExportOptions;