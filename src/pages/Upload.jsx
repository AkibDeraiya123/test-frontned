import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import CsvUploader from '../components/upload/CsvUploader';
import UploadStatus from '../components/upload/UploadStatus';
import ResultsTable from '../components/upload/ResultsTable';

function Upload() {
  const [uploadResult, setUploadResult] = useState(null);
  const [statusData, setStatusData] = useState(null);

  const handleUploadComplete = (result) => {
    setUploadResult(result);
    setStatusData(null);
  };

  const handleStatusComplete = (data) => {
    setStatusData(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload CSV
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload CSV files to create, update, or delete class schedules in bulk
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <CsvUploader onUploadComplete={handleUploadComplete} />
        </Grid>

        <Grid item xs={12} md={6}>
          {uploadResult && (
            <UploadStatus
              batchId={uploadResult.batchId}
              onComplete={handleStatusComplete}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          {statusData && statusData.results && (
            <ResultsTable results={statusData.results} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Upload;
