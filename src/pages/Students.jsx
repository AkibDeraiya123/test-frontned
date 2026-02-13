import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { masterApi } from '../api/masterApi';
import { format } from 'date-fns';

function Students() {
  const [filters, setFilters] = useState({
    search: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  // Get instructors for dropdown
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students', appliedFilters],
    queryFn: () => masterApi.getStudents(appliedFilters)
  });

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({ search: '' });
    setAppliedFilters({});
    refetch();
  };

  const students = data?.data || [];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Students
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Student name or Id"
            type="text"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear
          </Button>
        </Box>
      </Paper>

      <Paper>

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Error: {error.message}</Typography>
          </Box>
        ) : students.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {Object.keys(appliedFilters).length === 0
                ? 'Apply filters to view students'
                : 'No students found matching the filters'}
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Student Email</TableCell>
                  <TableCell>Student Status</TableCell>
                  <TableCell>Student Created At</TableCell>
                  <TableCell>Student Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={student.active ? 'success.main' : 'text.secondary'}
                      >
                        {student.active ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell>
                    <TableCell>{format(new Date(student?.metadata?.createdAt), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{format(new Date(student?.metadata?.updatedAt), 'MM/dd/yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default Students;
