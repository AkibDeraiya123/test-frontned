import apiClient from './client';

export const masterApi = {
  // Students
  getStudents: async (params = {}) => {
    return apiClient.get('/api/masters/students', { params });
  },

  createStudent: async (data) => {
    return apiClient.post('/api/masters/students', data);
  },

  updateStudent: async (studentId, data) => {
    return apiClient.put(`/api/masters/students/${studentId}`, data);
  },

  deleteStudent: async (studentId) => {
    return apiClient.delete(`/api/masters/students/${studentId}`);
  },

  // Instructors
  getInstructors: async (params = {}) => {
    return apiClient.get('/api/masters/instructors', { params });
  },

  // Class Types
  getClassTypes: async (params = {}) => {
    return apiClient.get('/api/masters/class-types', { params });
  },

  createClassType: async (data) => {
    return apiClient.post('/api/masters/class-types', data);
  },

  updateClassType: async (classTypeId, data) => {
    return apiClient.put(`/api/masters/class-types/${classTypeId}`, data);
  },

  deleteClassType: async (classTypeId) => {
    return apiClient.delete(`/api/masters/class-types/${classTypeId}`);
  }
};
