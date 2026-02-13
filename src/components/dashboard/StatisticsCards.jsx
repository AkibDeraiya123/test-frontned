import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import EventIcon from '@mui/icons-material/Event';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../api/reportApi';

function StatCard({ title, value, icon, color = 'primary.main' }) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: color,
            color: 'white',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

function StatisticsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: reportApi.getStatistics,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const stats = data?.data?.counts || {};

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon={<PeopleIcon />}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Instructors"
          value={stats.totalInstructors || 0}
          icon={<SchoolIcon />}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Scheduled Classes"
          value={stats.totalScheduledClasses || 0}
          icon={<ClassIcon />}
          color="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Today's Classes"
          value={stats.todayClasses || 0}
          icon={<EventIcon />}
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );
}

export default StatisticsCards;
