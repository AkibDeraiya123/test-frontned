import apiClient from './client';

export const configApi = {
  getAll: async () => {
    return apiClient.get('/api/config');
  },

  getByKey: async (key) => {
    return apiClient.get(`/api/config/${key}`);
  },

  update: async (key, value) => {
    return apiClient.put(`/api/config/${key}`, { value });
  }
};
