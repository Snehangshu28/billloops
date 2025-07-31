import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Paper,
  useMediaQuery,
} from '@mui/material';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import ProfileModal from '../profile/ProfileModal';

const drawerWidth = 220;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFFBDE' }}>
      <CssBaseline />

      {/* Navbar */}
      <Navbar
        onProfileOpen={() => setProfileOpen(true)}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />

      {/* Sidebar */}
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          position: { md: 'fixed' },
          height: { md: '100vh' },
          zIndex: 1200,
        }}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 3 },
          ml: { md: `${drawerWidth}px` },
          mt: 8,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 4,
          boxShadow: 3,
          minHeight: '100vh',
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 1, md: 2 }, bgcolor: 'transparent', boxShadow: 'none' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Outlet />
          </Box>
        </Paper>

        {/* Profile modal */}
        <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
