import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';
import Masters from './pages/Masters';
import Instructors from './pages/Instructors';
import Students from './pages/Students';
import ClassTypes from './pages/ClassTypes';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#008282',
    },
    secondary: {
      main: '#ff6b35',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/students" element={<Students />} />
            <Route path="/class-types" element={<ClassTypes />} />
          </Routes>
        </Layout>

    </ThemeProvider>
  );
}

export default App;
