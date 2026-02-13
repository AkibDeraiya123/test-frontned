import apiClient from './client';

export const masterApi = {
  // Students
  getStudents: async (params = {}) => {
    return apiClient.get('/api/masters/students', { params });
  },

  // Instructors
  getInstructors: async (params = {}) => {
    return apiClient.get('/api/masters/instructors', { params });
  },

  // Class Types
  getClassTypes: async (params = {}) => {
    return apiClient.get('/api/masters/class-types', { params });
  }
};
