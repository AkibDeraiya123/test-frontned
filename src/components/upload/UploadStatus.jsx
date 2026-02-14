import React, { useEffect, useRef, useState } from 'react';
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

  const onCompleteRef = useRef(onComplete);
  const latestStatusRef = useRef(null);
  const intervalRef = useRef(null);
  const completedFollowUpTimeoutRef = useRef(null);
  const pendingCompletedFollowUpRef = useRef(false);

  onCompleteRef.current = onComplete;
  latestStatusRef.current = status;

  useEffect(() => {
    if (!batchId) return;

    const checkStatus = async () => {
      try {
        const result = await uploadApi.getUploadStatus(batchId);
        const data = result.data;
        latestStatusRef.current = data;
        setStatus(data);
        setLoading(false);

        if (data.status === 'completed' || data.status === 'failed') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          if (data.status === 'completed' && !pendingCompletedFollowUpRef.current) {
            // One more check after 3s so we get all records before calling onComplete
            pendingCompletedFollowUpRef.current = true;
            completedFollowUpTimeoutRef.current = setTimeout(() => {
              completedFollowUpTimeoutRef.current = null;
              checkStatus();
            }, 2000);
          } else {
            if (pendingCompletedFollowUpRef.current) {
              pendingCompletedFollowUpRef.current = false;
            }
            onCompleteRef.current?.(data);
          }
          return;
        }
      } catch (error) {
        setLoading(false);
      }
    };

    // Check immediately
    checkStatus();

    // Poll every 2 seconds only while still processing
    intervalRef.current = setInterval(() => {
      if (latestStatusRef.current?.status === 'processing') {
        checkStatus();
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (completedFollowUpTimeoutRef.current) {
        clearTimeout(completedFollowUpTimeoutRef.current);
        completedFollowUpTimeoutRef.current = null;
      }
      pendingCompletedFollowUpRef.current = false;
    };
  }, [batchId]);

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
