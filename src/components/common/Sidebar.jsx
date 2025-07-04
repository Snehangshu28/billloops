import React, { useState } from 'react';
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

const drawerWidth = 220;
const PALETTE = {
  forest: '#2F5249',
  moss: '#437057',
  olive: '#97B067',
  mustard: '#E3DE61',
};
const FONT = { fontFamily: 'Poppins, sans-serif' };

const tabs = [
  { label: 'Bill', icon: <ReceiptLongIcon sx={{ fontSize: 30 }} /> },
  { label: 'Stock', icon: <Inventory2Icon sx={{ fontSize: 30 }} /> },
  { label: 'Employee', icon: <PeopleIcon sx={{ fontSize: 30 }} /> },
  { label: 'Analysis', icon: <BarChartIcon sx={{ fontSize: 30 }} /> },
  { label: 'Customer', icon: <GroupIcon sx={{ fontSize: 30 }} /> },
];

const Sidebar = ({
  selectedTab,
  setSelectedTab,
  billSubView,
  setBillSubView,
  isMobile,
  mobileOpen,
  setMobileOpen,
  handleDrawerToggle,
}) => {
  const [billMenuOpen, setBillMenuOpen] = useState(false);

  const handleTabClick = (idx) => {
    if (tabs[idx].label === 'Bill') {
      setBillMenuOpen((open) => !open);
    } else {
      setSelectedTab(idx);
      if (isMobile) setMobileOpen(false);
    }
  };

  const handleBillSubmenuClick = (submenuIdx) => {
    setSelectedTab(0); // Always Bill tab
    if (setBillSubView) {
      if (submenuIdx === 0) setBillSubView('create');
      if (submenuIdx === 1) setBillSubView('records');
      if (submenuIdx === 2) setBillSubView('settings');
    }
    if (isMobile) setMobileOpen(false);
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
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.label}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedTab === idx}
                onClick={() => handleTabClick(idx)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  background:
                    selectedTab === idx ? PALETTE.moss : 'transparent',
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
                    fontWeight: selectedTab === idx ? 700 : 500,
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
              </ListItemButton>
            </ListItem>
            {tab.label === 'Bill' && (
              <Collapse in={billMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  <ListItemButton
                    onClick={() => handleBillSubmenuClick(0)}
                    sx={{ borderRadius: 2, mb: 1, ...FONT }}
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
                    onClick={() => handleBillSubmenuClick(1)}
                    sx={{ borderRadius: 2, mb: 1, ...FONT }}
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
                    onClick={() => handleBillSubmenuClick(2)}
                    sx={{ borderRadius: 2, ...FONT }}
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
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
