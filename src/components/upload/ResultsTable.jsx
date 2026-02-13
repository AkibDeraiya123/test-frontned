import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function ResultsTable({ results }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ mt: 3 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Processing Results
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Registration ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.rowNumber}>
                <TableCell>{result.rowNumber}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {result.registrationId || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={result.action}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {result.status === 'success' ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Success"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<ErrorIcon />}
                      label="Error"
                      color="error"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{result.message}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ResultsTable;
