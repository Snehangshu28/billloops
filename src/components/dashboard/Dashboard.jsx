import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  Paper,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Bill from './Bill';
import Stock from './Stock';
import Employee from './Employee';
import Analysis from './Analysis';
import ProfileModal from '../profile/ProfileModal';
import Customer from './Customer';
import GroupIcon from '@mui/icons-material/Group';

const drawerWidth = 220;

const tabs = [
  { label: 'Bill', icon: <ReceiptLongIcon sx={{ fontSize: 30 }} /> },
  { label: 'Stock', icon: <Inventory2Icon sx={{ fontSize: 30 }} /> },
  { label: 'Employee', icon: <PeopleIcon sx={{ fontSize: 30 }} /> },
  { label: 'Analysis', icon: <BarChartIcon sx={{ fontSize: 30 }} /> },
  { label: 'Customer', icon: <GroupIcon sx={{ fontSize: 30 }} /> },
];

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useMediaQuery('(max-width:900px)');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #3f51b5 0%, #6573c3 100%)',
        color: '#fff',
        p: 0,
      }}
    >
      <Toolbar sx={{ minHeight: 72 }} />
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List sx={{ mt: 2 }}>
        {tabs.map((tab, idx) => (
          <ListItem key={tab.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={selectedTab === idx}
              onClick={() => {
                setSelectedTab(idx);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                background: selectedTab === idx ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': {
                  background: 'rgba(255,255,255,0.10)',
                },
                transition: 'background 0.2s',
                minHeight: 56,
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 44 }}>{tab.icon}</ListItemIcon>
              <ListItemText
                primary={tab.label}
                primaryTypographyProps={{ fontWeight: selectedTab === idx ? 700 : 500, fontSize: 18 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <Bill />;
      case 1:
        return <Stock />;
      case 2:
        return <Employee />;
      case 3:
        return <Analysis />;
      case 4:
        return <Customer />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'primary.main',
          boxShadow: 2,
          borderBottom: '1px solid #e3e9f7',
        }}
        elevation={0}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 700, letterSpacing: 1 }}
          >
            BILLUS
          </Typography>
          <IconButton color="primary" sx={{ ml: 2 }} onClick={() => setProfileOpen(true)}>
            <Avatar alt="Profile" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 1, md: 2 }, bgcolor: 'transparent', boxShadow: 'none' }}>
          {renderContent()}
        </Paper>
        <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      </Box>
    </Box>
  );
};

export default Dashboard; 