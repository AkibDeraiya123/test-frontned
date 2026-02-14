import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configApi } from '../../api/configApi';

function ConfigForm() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['config'],
    queryFn: configApi.getAll
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }) => configApi.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries(['config']);
      setSuccessMessage('Configuration updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditMode({});
      setEditValues({});
    },
    onError: (error) => {
      console.error(error);
      setErrorMessage('Error updating configuration: ' + error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">Error loading configuration: {error.message}</Alert>
      </Paper>
    );
  }

  const configs = data?.data || {};

  const configDefinitions = [
    {
      key: 'student_max_classes_per_day',
      label: 'Student Max Classes Per Day',
      description: 'Maximum number of classes a student can schedule per day',
      type: 'number',
      category: 'Limits'
    },
    {
      key: 'instructor_max_classes_per_day',
      label: 'Instructor Max Classes Per Day',
      description: 'Maximum number of classes an instructor can teach per day',
      type: 'number',
      category: 'Limits'
    },
    {
      key: 'class_duration_minutes',
      label: 'Class Duration (Minutes)',
      description: 'Default duration of a class in minutes',
      type: 'number',
      category: 'System'
    },
    {
      key: 'max_classes_per_type_per_day',
      label: 'Max Classes Per Type Per Day',
      description: 'Maximum number of classes of a specific type per day',
      type: 'number',
      category: 'Limits'
    },
    {
      key: 'enable_student_auto_add',
      label: 'Enable Student Auto-Add',
      description: 'Automatically add new student IDs found in CSV uploads',
      type: 'boolean',
      category: 'Features'
    },
    {
      key: 'enable_instructor_auto_add',
      label: 'Enable Instructor Auto-Add',
      description: 'Automatically add new instructor IDs found in CSV uploads',
      type: 'boolean',
      category: 'Features'
    },
    {
      key: 'enable_class_type_auto_add',
      label: 'Enable classType Auto-Add',
      description: 'Automatically add new classType IDs found in CSV uploads',
      type: 'boolean',
      category: 'Features'
    }
  ];

  const handleEdit = (key, value) => {
    setEditMode({ ...editMode, [key]: true });
    setEditValues({ ...editValues, [key]: value });
  };

  const handleCancel = (key) => {
    setEditMode({ ...editMode, [key]: false });
    setEditValues({ ...editValues, [key]: undefined });
  };

  const handleSave = (key, type) => {
    let value = editValues[key];

    if (type === 'number') {
      value = parseInt(value, 10);
    }

    updateMutation.mutate({ key, value });
  };

  const groupedConfigs = configDefinitions.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {});

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {Object.keys(groupedConfigs).map((category) => (
        <Paper key={category} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {groupedConfigs[category].map((config) => {
              const currentValue = configs[config.key];
              const isEditing = editMode[config.key];
              const editValue = editValues[config.key];

              return (
                <Grid item xs={12} key={config.key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {config.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {config.description}
                      </Typography>
                    </Box>

                    {config.type === 'boolean' ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isEditing ? editValue : currentValue}
                            onChange={(e) => {
                              setEditValues({ ...editValues, [config.key]: e.target.checked });
                              updateMutation.mutate({ key: config.key, value: e.target.checked });
                            }}
                          />
                        }
                        label={isEditing ? editValue ? 'Enabled' : 'Disabled' : currentValue ? 'Enabled' : 'Disabled'}
                      />
                    ) : isEditing ? (
                      <>
                        <TextField
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValues({ ...editValues, [config.key]: e.target.value })}
                          size="small"
                          sx={{ width: 120 }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSave(config.key, config.type)}
                          disabled={updateMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleCancel(config.key)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ minWidth: 60, textAlign: 'right' }}>
                          {currentValue}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(config.key, currentValue)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}

export default ConfigForm;
