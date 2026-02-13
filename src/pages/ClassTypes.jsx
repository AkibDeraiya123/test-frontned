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

function ClassTypes() {
  const [filters, setFilters] = useState({
    search: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  // Get instructors for dropdown
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['classTypes', appliedFilters],
    queryFn: () => masterApi.getClassTypes(appliedFilters)
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

  const classTypes = data?.data || [];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Class Types
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Class Type Id or name "
            type="text"
            placeholder="Search by Id or name"
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
        ) : classTypes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {Object.keys(appliedFilters).length === 0
                ? 'Apply filters to view class types'
                : 'No class types found matching the filters'}
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Class Type ID</TableCell>
                  <TableCell>Class Type Name</TableCell>
                  <TableCell>Class Type Description</TableCell>
                  <TableCell>Class Type Status</TableCell>
                  <TableCell>Class Type Created At</TableCell>
                  <TableCell>Class Type Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classTypes.map((classType) => (
                  <TableRow key={classType.classTypeId}>
                    <TableCell>{classType.classTypeId}</TableCell>
                    <TableCell>{classType.name}</TableCell>
                    <TableCell>{classType.description}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={classType.active ? 'success.main' : 'text.secondary'}
                      >
                        {classType.active ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell>
                    <TableCell>{format(new Date(classType?.metadata?.createdAt), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{format(new Date(classType?.metadata?.updatedAt), 'MM/dd/yyyy')}</TableCell>
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

export default ClassTypes;
