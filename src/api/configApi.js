import apiClient from './client';

export const configApi = {
  getAll: async () => {
    return apiClient.get('/api/config');
  },

  update: async (key, value) => {
    return apiClient.put(`/api/config/${key}`, { value });
  }
};
