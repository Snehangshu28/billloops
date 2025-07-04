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
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#437057', // Olive green
      light: '#97B067',
      dark: '#2F5249',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E3DE61', // Mustard yellow
      light: '#F8F9F6',
      dark: '#CBC3E3',
      contrastText: '#2F5249',
    },
    background: {
      default: '#F8F9F6',
      paper: '#fff',
    },
    text: {
      primary: '#2F5249',
      secondary: '#6B7280',
    },
    success: { main: '#97B067' },
    warning: { main: '#E3DE61' },
    info: { main: '#D7C9E7' },
    error: { main: '#D32F2F' },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px 0px rgba(67,112,87,0.08)',
    ...Array(23).fill('0px 4px 24px 0px rgba(67,112,87,0.07)'),
  ],
  typography: {
    fontFamily: 'Poppins, sans-serif',
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
          boxShadow: '0 2px 8px 0 rgba(67,112,87,0.08)',
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(67,112,87,0.07)',
          fontFamily: 'Poppins, sans-serif',
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
    document.title = 'Billoops';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          minHeight: '100vh',
          background: '#F8F9F6',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <BusinessProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route
                  path="*"
                  element={<Navigate to="/onboarding" replace />}
                /> */}
              </Routes>
              <Routes>
                {/* <Route path="/" element={<PrivateRoute />}> */}
                <Route path="/dashboard" element={<Dashboard />} />
                {/* </Route> */}
              </Routes>
            </AuthProvider>
          </Router>
        </BusinessProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
