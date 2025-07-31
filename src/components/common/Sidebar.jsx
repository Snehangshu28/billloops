import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Collapse,
  useTheme,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 220;
const PALETTE = {
  forest: '#2F5249',
  moss: '#437057',
  olive: '#97B067',
  mustard: '#E3DE61',
};
const FONT = { fontFamily: 'Poppins, sans-serif' };

const tabs = [
  { label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 30 }} />, path: '/dashboard' },
  { label: 'Bill', icon: <ReceiptLongIcon sx={{ fontSize: 30 }} />, path: '/bill' },
  { label: 'Master', icon: <SettingsIcon sx={{ fontSize: 30 }} />, path: '/master' },
  { label: 'Employee', icon: <PeopleIcon sx={{ fontSize: 30 }} />, path: '/employee' },
  { label: 'Customer', icon: <GroupIcon sx={{ fontSize: 30 }} />, path: '/customer' },
  { label: 'Offer', icon: <LocalOfferIcon sx={{ fontSize: 30 }} />, path: '/offer' }
];

const Sidebar = ({
  isMobile,
  mobileOpen,
  setMobileOpen,
  handleDrawerToggle,
}) => {
  const [billMenuOpen, setBillMenuOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    if (tab.label === 'Bill') {
      setBillMenuOpen((open) => !open);
    } else if (tab.label === 'Master') {
      setMasterMenuOpen((open) => !open);
    } else {
      navigate(tab.path);
      if (isMobile) setMobileOpen(false);
    }
  };

  const handleBillSubmenuClick = (submenuPath) => {
    navigate(submenuPath);
    if (isMobile) setMobileOpen(false);
  };

  const handleMasterSubmenuClick = (submenuPath) => {
    navigate(submenuPath);
    if (isMobile) setMobileOpen(false);
  };

  const isActiveTab = (tab) => {
    if (tab.label === 'Bill') {
      return location.pathname.startsWith('/bill');
    } else if (tab.label === 'Master') {
      return location.pathname.startsWith('/master');
    }
    return location.pathname === tab.path;
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        background: PALETTE.forest,
        color: '#fff',
        p: 0,
        position: 'relative',
        width: drawerWidth,
      }}
    >
      <Toolbar sx={{ minHeight: 72 }} />
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List sx={{ mt: 2 }}>
        {tabs.map((tab) => (
          <React.Fragment key={tab.label}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActiveTab(tab)}
                onClick={() => handleTabClick(tab)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  background:
                    isActiveTab(tab) ? PALETTE.moss : 'transparent',
                  '&:hover': {
                    background: PALETTE.olive,
                    color: '#fff',
                  },
                  transition: 'background 0.2s',
                  minHeight: 56,
                  color: '#fff',
                  ...FONT,
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 44 }}>
                  {tab.icon}
                </ListItemIcon>
                <ListItemText
                  primary={tab.label}
                  primaryTypographyProps={{
                    fontWeight: isActiveTab(tab) ? 700 : 500,
                    fontSize: 18,
                    ...FONT,
                  }}
                />
                {tab.label === 'Bill' ? (
                  billMenuOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
                {tab.label === 'Master' ? (
                  masterMenuOpen ? <ExpandLess /> : <ExpandMore />
                ) : null}
              </ListItemButton>
            </ListItem>
            {tab.label === 'Bill' && (
              <Collapse in={billMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  <ListItemButton
                    onClick={() => handleBillSubmenuClick('/bill/create')}
                    sx={{ 
                      borderRadius: 2, 
                      mb: 1, 
                      ...FONT,
                      background: location.pathname === '/bill/create' ? PALETTE.moss : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                      <ReceiptLongIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Create Bill"
                      primaryTypographyProps={{ fontSize: 16, ...FONT }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleBillSubmenuClick('/bill/records')}
                    sx={{ 
                      borderRadius: 2, 
                      mb: 1, 
                      ...FONT,
                      background: location.pathname === '/bill/records' ? PALETTE.moss : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Show Records"
                      primaryTypographyProps={{ fontSize: 16, ...FONT }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleBillSubmenuClick('/bill/settings')}
                    sx={{ 
                      borderRadius: 2, 
                      ...FONT,
                      background: location.pathname === '/bill/settings' ? PALETTE.moss : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Bill Settings"
                      primaryTypographyProps={{ fontSize: 16, ...FONT }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            )}
            {tab.label === 'Master' && (
              <Collapse in={masterMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  <ListItemButton
                    onClick={() => handleMasterSubmenuClick('/master/product-category')}
                    sx={{ 
                      borderRadius: 2, 
                      mb: 1, 
                      ...FONT,
                      background: location.pathname === '/master/product-category' ? PALETTE.moss : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                      <Inventory2Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Product Category"
                      primaryTypographyProps={{ fontSize: 16, ...FONT }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleMasterSubmenuClick('/master/stock')}
                    sx={{ 
                      borderRadius: 2, 
                      ...FONT,
                      background: location.pathname === '/master/stock' ? PALETTE.moss : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                      <Inventory2Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Stock"
                      primaryTypographyProps={{ fontSize: 16, ...FONT }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  // Only render Drawer for mobile, static sidebar for desktop
  if (isMobile) {
    return (
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
        {sidebarContent}
      </Drawer>
    );
  }
  // Desktop: always visible static sidebar
  return (
    <Box
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    display: { xs: 'none', md: 'block' },
    position: 'fixed',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 1200,
    overflowY: 'auto',
  }}
>
  {sidebarContent}
</Box>
);
};

export default Sidebar;
