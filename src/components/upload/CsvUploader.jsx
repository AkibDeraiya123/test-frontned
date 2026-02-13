import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadApi } from '../../api/uploadApi';

function CsvUploader({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);

    try {
      const result = await uploadApi.uploadCSV(file);
      setUploading(false);

      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      setUploading(false);
      setError(err.message || 'Upload failed');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: uploading ? 'grey.300' : 'primary.main',
            bgcolor: uploading ? 'background.paper' : 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />

        {uploading ? (
          <>
            <Typography variant="h6" gutterBottom>
              Uploading...
            </Typography>
            <LinearProgress sx={{ mt: 2 }} />
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop CSV file here' : 'Drag & drop CSV file here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or
            </Typography>
            <Button variant="contained" component="span" sx={{ mt: 1 }}>
              Browse Files
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
              Supported format: CSV (Max 10MB)
            </Typography>
          </>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default CsvUploader;
