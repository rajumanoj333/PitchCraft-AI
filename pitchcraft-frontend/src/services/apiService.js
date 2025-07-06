// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const generatePitch = async (idea) => {
  const response = await axios.post(`${API_URL}/generate-pitch`, { idea });
  return response.data;
};

export const saveProject = async (projectData) => {
  const response = await axios.post(`${API_URL}/pitch`, projectData);
  return response.data;
};

export const exportPDF = async (projectId) => {
  const response = await axios.get(`${API_URL}/export/pdf/${projectId}`, {
    responseType: 'blob'
  });
  return response.data;
};

export const sendEmail = async (projectId, email) => {
  const response = await axios.post(`${API_URL}/export/email`, {
    projectId,
    email
  });
  return response.data;
};

export const generateVideo = async (projectId) => {
  const response = await axios.get(`${API_URL}/export/video/${projectId}`, {
    responseType: 'blob'
  });
  return response.data;
};