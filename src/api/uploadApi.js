import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const uploadApi = {
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/api/upload/csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  getUploadStatus: async (batchId) => {
    const response = await axios.get(`${API_URL}/api/upload/status/${batchId}`);
    return response.data;
  }
};
