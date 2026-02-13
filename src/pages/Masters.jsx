import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Masters() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Master Lists
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Master lists for students, instructors, and class types will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Masters;
