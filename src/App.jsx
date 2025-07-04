import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Onboarding from './components/onboarding/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import { BusinessProvider } from './context/BusinessContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#6573c3',
      dark: '#2c387e',
      contrastText: '#fff',
    },
    secondary: {
      main: '#e91e63', // Pink
      light: '#ff6090',
      dark: '#b0003a',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6fb',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px 0px rgba(63,81,181,0.08)',
    ...Array(23).fill('0px 4px 24px 0px rgba(63,81,181,0.07)'),
  ],
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 600, fontSize: '1.2rem' },
    h5: { fontWeight: 500, fontSize: '1rem' },
    h6: { fontWeight: 500, fontSize: '0.95rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px 0 rgba(63,81,181,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(63,81,181,0.07)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    document.title = 'BILLUS';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3e9f7 0%, #f4f6fb 100%)',
        }}
      >
        <BusinessProvider>
          <Router>
            <Routes>
              <Route path="/onboarding/*" element={<Onboarding />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </Routes>
          </Router>
        </BusinessProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
