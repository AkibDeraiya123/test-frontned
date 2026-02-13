import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import { uploadApi } from '../../api/uploadApi';

function UploadStatus({ batchId, onComplete }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) return;

    const checkStatus = async () => {
      try {
        const result = await uploadApi.getUploadStatus(batchId);
        setStatus(result.data);
        setLoading(false);

        if (result.data.status === 'completed' || result.data.status === 'failed') {
          if (onComplete) {
            onComplete(result.data);
          }
        }
      } catch (error) {
        setLoading(false);
      }
    };

    // Check immediately
    checkStatus();

    // Poll every 2 seconds while processing
    const interval = setInterval(() => {
      if (status?.status === 'processing') {
        checkStatus();
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [batchId, status?.status, onComplete]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">Loading status...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Paper>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Upload Status</Typography>
        <Chip label={status.status} color={getStatusColor()} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Batch ID: {status.batchId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          File: {status.fileName}
        </Typography>
      </Box>

      {status.status === 'processing' && (
        <Box>
          <Typography variant="body2" gutterBottom>
            Processing rows... ({status.successCount + status.errorCount} / {status.totalRows})
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((status.successCount + status.errorCount) / status.totalRows) * 100}
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      {status.status === 'completed' && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success" sx={{ mb: 1 }}>
            Upload completed successfully!
          </Alert>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip label={`✓ ${status.successCount} Success`} color="success" />
            <Chip label={`✗ ${status.errorCount} Errors`} color="error" />
            <Chip label={`Total: ${status.totalRows}`} />
          </Box>
        </Box>
      )}

      {status.status === 'failed' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Upload failed: {status.error}
        </Alert>
      )}
    </Paper>
  );
}

export default UploadStatus;
