// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const generatePitch = async (idea, token) => {
  const response = await axios.post(
    `${API_URL}/generate-pitch`,
    { idea },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const saveProject = async (projectData, token) => {
  // Implementation similar to above
};

export const exportPDF = async (projectId, token) => {
  const response = await axios.get(
    `${API_URL}/export/pdf/${projectId}`,
    { 
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }
  );
  return response.data;
};