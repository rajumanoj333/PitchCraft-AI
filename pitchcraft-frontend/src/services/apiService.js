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
  const response = await axios.post(
    `${API_URL}/pitch`,
    projectData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
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

export const sendEmail = async (projectId, email, token) => {
  const response = await axios.post(
    `${API_URL}/export/email`,
    { projectId, email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const generateVideo = async (projectId, token) => {
  const response = await axios.get(
    `${API_URL}/export/video/${projectId}`,
    { 
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }
  );
  return response.data;
};