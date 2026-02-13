import apiClient from './client';

export const reportApi = {
  getClassesPerDay: async (startDate, endDate) => {
    return apiClient.get('/api/reports/classes-per-day', {
      params: { startDate, endDate }
    });
  },

  getFilteredClasses: async (filters = {}) => {
    return apiClient.get('/api/reports/classes-filtered', {
      params: filters
    });
  },

  getStatistics: async () => {
    return apiClient.get('/api/reports/statistics');
  },

  getInstructorReport: async (instructorId, startDate, endDate) => {
    return apiClient.get(`/api/reports/instructor/${instructorId}`, {
      params: { startDate, endDate }
    });
  }
};
