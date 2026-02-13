import React, { useEffect, useState } from 'react';
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
  MenuItem
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../api/reportApi';
import { masterApi } from '../../api/masterApi';
import { format } from 'date-fns';

function ClassesReport() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    instructorId: '',
    classTypeId: '',
    studentId: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  // Get instructors for dropdown
  const { data: instructorsData } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => masterApi.getInstructors()
  });

  // Get class types for dropdown
  const { data: classTypesData } = useQuery({
    queryKey: ['classTypes'],
    queryFn: () => masterApi.getClassTypes()
  });

  // Get students for dropdown
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => masterApi.getStudents()
  });

  // Get filtered classes
  const { data, isLoading, error } = useQuery({
    queryKey: ['filteredClasses', appliedFilters],
    queryFn: () => reportApi.getFilteredClasses(appliedFilters),
    enabled: Object.keys(appliedFilters).length > 0
  });

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { startDate: '', endDate: '', instructorId: '', classTypeId: '', studentId: '' };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const instructors = instructorsData?.data || [];
  const classTypes = classTypesData?.data || [];
  const students = studentsData?.data || [];

  const classes = data?.data || [];

  useEffect(() => {
    setAppliedFilters(filters);
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Instructor"
            value={filters.instructorId}
            onChange={(e) => setFilters({ ...filters, instructorId: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Instructors</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.instructorId} value={instructor.instructorId}>
                {instructor.name} ({instructor.instructorId})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Class Type"
            value={filters.classTypeId}
            onChange={(e) => setFilters({ ...filters, classTypeId: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Class Types</MenuItem>
            {classTypes.map((classType) => (
              <MenuItem key={classType.classTypeId} value={classType.classTypeId}>
                {classType.name} ({classType.classTypeId})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Student"
            value={filters.studentId}
            onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Students</MenuItem>
            {students.map((student) => (
              <MenuItem key={student.studentId} value={student.studentId}>
                {student.name} ({student.studentId})
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear
          </Button>
        </Box>
      </Paper>

      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Classes Report</Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Error: {error.message}</Typography>
          </Box>
        ) : classes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {Object.keys(appliedFilters).length === 0
                ? 'Apply filters to view classes'
                : 'No classes found matching the filters'}
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Registration ID</TableCell>
                  <TableCell>Class Type</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.registrationId}>
                    <TableCell>{cls.registrationId}</TableCell>
                    <TableCell>{cls.classTypeName}</TableCell>
                    <TableCell>{cls.instructorName}</TableCell>
                    <TableCell>
                      {cls.studentNames?.join(', ') || cls.studentIds?.join(', ')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(cls.schedule.date), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(cls.schedule.startTime), 'HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={cls.status === 'scheduled' ? 'success.main' : 'text.secondary'}
                      >
                        {cls.status}
                      </Typography>
                    </TableCell>
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

export default ClassesReport;
