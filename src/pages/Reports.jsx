import React from 'react';
import { Box, Typography } from '@mui/material';
import ClassesReport from '../components/reports/ClassesReport';

function Reports() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        View and filter class schedules by date, instructor, class type and student.
      </Typography>

      <ClassesReport />
    </Box>
  );
}

export default Reports;
