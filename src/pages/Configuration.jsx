import React from 'react';
import { Box, Typography } from '@mui/material';
import ConfigForm from '../components/configuration/ConfigForm';

function Configuration() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Manage system configurations and settings
      </Typography>

      <ConfigForm />
    </Box>
  );
}

export default Configuration;
