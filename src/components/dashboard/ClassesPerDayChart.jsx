import React, { useMemo } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../api/reportApi';
import { format, addDays } from 'date-fns';

function ClassesPerDayChart() {
  const startDate = format(new Date(), 'yyyy-MM-dd');
  // add more 30 days to the start date
  const endDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

  const { data, isLoading, error } = useQuery({
    queryKey: ['classesPerDay', startDate, endDate],
    queryFn: () => reportApi.getClassesPerDay(startDate, endDate),
    refetchInterval: 60000 // Refetch every minute
  });

  // Generate all dates for next 30 days and merge with backend data
  const chartData = useMemo(() => {
    const backendData = data?.data || [];
    
    // Create a map of date -> count from backend data
    const dataMap = new Map();
    backendData.forEach(item => {
      dataMap.set(item.date, item.count);
    });

    // Generate all dates for next 30 days
    const allDates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      allDates.push({
        date: dateStr,
        count: dataMap.get(dateStr) || 0
      });
    }

    return allDates;
  }, [data]);

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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Classes Per Day (For Next 30 Days)
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Note: This chart will update automatically every minute automatically. You don't need to refresh the page manually.
      </Typography>
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
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} />
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
    </Paper>
  );
}

export default ClassesPerDayChart;
