import React from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../api/reportApi';
import { format, addDays } from 'date-fns';

function ClassesPerDayChart() {
  const startDate = format(new Date(), 'yyyy-MM-dd');
  // instead of last 30 days add next 30 days
  const endDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  const { data, isLoading, error } = useQuery({
    queryKey: ['classesPerDay', startDate, endDate],
    queryFn: () => reportApi.getClassesPerDay(startDate, endDate),
    refetchInterval: 60000 // Refetch every minute
  });

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading chart...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">Error loading chart: {error.message}</Typography>
      </Paper>
    );
  }

  const chartData = data?.data || [];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Classes Per Day (Upcoming 90 Days)
      </Typography>
      {chartData.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No data available
        </Typography>
      ) : (
        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1976d2"
                strokeWidth={2}
                name="Classes Scheduled"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

export default ClassesPerDayChart;
