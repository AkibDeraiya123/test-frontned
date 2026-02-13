import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import ClassesPerDayChart from '../components/dashboard/ClassesPerDayChart';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Overview of class scheduling system
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatisticsCards />
        </Grid>

        <Grid item xs={12}>
          <ClassesPerDayChart />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
