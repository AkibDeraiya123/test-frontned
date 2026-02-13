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

function Instructors() {
  const [filters, setFilters] = useState({
    search: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  // Get instructors for dropdown
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['instructors', appliedFilters],
    queryFn: () => masterApi.getInstructors(appliedFilters)
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

  const instructors = data?.data || [];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Instructor name or Id"
            type="text"
            placeholder="Search by name or Id"
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
        ) : instructors.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {Object.keys(appliedFilters).length === 0
                ? 'Apply filters to view instructors'
                : 'No instructors found matching the filters'}
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Instructor ID</TableCell>
                  <TableCell>Instructor Name</TableCell>
                  <TableCell>Instructor Email</TableCell>
                  <TableCell>Instructor Status</TableCell>
                  <TableCell>Instructor Created At</TableCell>
                  <TableCell>Instructor Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instructors.map((instructor) => (
                  <TableRow key={instructor.instructorId}>
                    <TableCell>{instructor.instructorId}</TableCell>
                    <TableCell>{instructor.name}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={instructor.active ? 'success.main' : 'text.secondary'}
                      >
                        {instructor.active ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell>
                    <TableCell>{format(new Date(instructor?.metadata?.createdAt), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{format(new Date(instructor?.metadata?.updatedAt), 'MM/dd/yyyy')}</TableCell>
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

export default Instructors;
