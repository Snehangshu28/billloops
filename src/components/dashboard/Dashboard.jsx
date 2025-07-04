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
  Grid,
  Card,
  CardContent,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
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
import { Spa, Receipt, TrendingUp } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';

const drawerWidth = 220;

const tabs = [
  { label: 'Bill', icon: <ReceiptLongIcon sx={{ fontSize: 30 }} /> },
  { label: 'Stock', icon: <Inventory2Icon sx={{ fontSize: 30 }} /> },
  { label: 'Employee', icon: <PeopleIcon sx={{ fontSize: 30 }} /> },
  { label: 'Analysis', icon: <BarChartIcon sx={{ fontSize: 30 }} /> },
  { label: 'Customer', icon: <GroupIcon sx={{ fontSize: 30 }} /> },
];

const PALETTE = {
  forest: '#2F5249', // sidebar bg, headings, primary text
  moss: '#437057', // active menu, primary buttons, form borders
  olive: '#97B067', // icon circles, hover backgrounds, tag highlights
  mustard: '#E3DE61', // CTA buttons, badges, invoice status
  card: '#fff',
  background: '#FFFBDE',
  shadow: '0 4px 16px rgba(67,112,87,0.08)',
};

const FONT = { fontFamily: 'Poppins, sans-serif' };

const widgets = [
  {
    icon: <PeopleIcon fontSize="large" />, label: 'Customers', value: '1,245',
    color: PALETTE.moss,
  },
  {
    icon: <ReceiptLongIcon fontSize="large" />, label: 'Bills', value: '3,210',
    color: PALETTE.moss,
  },
  {
    icon: <TrendingUp fontSize="large" />, label: 'Revenue', value: '₹2,45,000',
    color: PALETTE.mustard,
  },
  {
    icon: <Spa fontSize="large" />, label: 'Services', value: '18',
    color: PALETTE.moss,
  },
];

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [billSubView, setBillSubView] = useState('create');
  const [billDrawerOpen, setBillDrawerOpen] = useState(false);
  const [billDrawerView, setBillDrawerView] = useState('create');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');
  const [profileOpen, setProfileOpen] = useState(false);

  // Dummy previous bills for demo
  const previousBills = [
    { id: 'INV-001', client: 'Alice', date: '2024-06-10', amount: 1200 },
    { id: 'INV-002', client: 'Bob', date: '2024-06-10', amount: 800 },
    { id: 'INV-003', client: 'Charlie', date: '2024-06-09', amount: 1500 },
  ];

  // Drawer menu options
  const billDrawerMenu = [
    { key: 'create', label: 'Create a Bill', icon: <ReceiptLongIcon /> },
    { key: 'records', label: 'Show previous records', icon: <HistoryIcon /> },
  ];

  // Bill Drawer content
  const renderBillDrawerContent = () => (
    <Box sx={{ width: 320, p: 3, background: '#328E6E', height: '100%', color: '#fff', ...FONT }} onMouseLeave={() => setBillDrawerOpen(false)}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 2, color: '#fff', ...FONT }}>Billing</Typography>
      <List>
        {billDrawerMenu.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={billDrawerView === item.key}
              onClick={() => setBillDrawerView(item.key)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                background: billDrawerView === item.key ? PALETTE.moss : 'transparent',
                color: '#fff',
                transition: 'all 0.3s',
                '&:hover': { background: PALETTE.olive },
                minHeight: 48,
                ...FONT,
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: 16, ...FONT }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {billDrawerView === 'records' && (
        <Box sx={{ mt: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
            <DatePicker label="From" value={dateFrom} onChange={setDateFrom} sx={{ ...FONT, bgcolor: '#fff', borderRadius: 2 }} />
            <DatePicker label="To" value={dateTo} onChange={setDateTo} sx={{ ...FONT, bgcolor: '#fff', borderRadius: 2 }} />
          </Stack>
          <Paper sx={{ bgcolor: '#fff', color: PALETTE.text, borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1, color: PALETTE.forest }}>Previous Bills</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previousBills.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.client}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>₹{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
      {billDrawerView === 'create' && (
        <Button
          variant="contained"
          sx={{ mt: 4, background: PALETTE.mustard, color: PALETTE.forest, fontWeight: 600, borderRadius: 9999, px: 4, py: 1.5, fontSize: 16, transition: 'all 0.3s', '&:hover': { background: PALETTE.olive } }}
          onClick={() => {
            setSelectedTab(0);
            setBillDrawerOpen(false);
          }}
        >
          Go to Billing Page
        </Button>
      )}
    </Box>
  );

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: PALETTE.forest,
        color: '#fff',
        p: 0,
        position: 'relative',
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
              onMouseEnter={() => {
                if (tab.label === 'Bill') setBillDrawerOpen(true);
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                background: selectedTab === idx ? PALETTE.moss : 'transparent',
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
              <ListItemIcon sx={{ color: '#fff', minWidth: 44 }}>{tab.icon}</ListItemIcon>
              <ListItemText
                primary={tab.label}
                primaryTypographyProps={{ fontWeight: selectedTab === idx ? 700 : 500, fontSize: 18, ...FONT }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* Bill Drawer */}
      <Box sx={{ position: 'absolute', left: drawerWidth, top: 0, height: '100%', zIndex: 1300 }}>
        <Drawer
          anchor="left"
          open={billDrawerOpen}
          onClose={() => setBillDrawerOpen(false)}
          transitionDuration={300}
          PaperProps={{ sx: { width: 320, background: '#328E6E', color: '#fff', borderTopRightRadius: 16, borderBottomRightRadius: 16, boxShadow: 6, transition: 'all 0.3s', ...FONT } }}
          variant={isMobile ? 'temporary' : 'persistent'}
          hideBackdrop
        >
          {renderBillDrawerContent()}
        </Drawer>
      </Box>
    </Box>
  );

  const renderContent = () => {
    if (selectedTab === 0) {
      switch (billSubView) {
        case 'create':
          return <Bill />;
        case 'records':
          return (
            <div>
              <h2>Show Records</h2>
            </div>
          );
        case 'settings':
          return (
            <div>
              <h2>Bill Settings</h2>
            </div>
          );
        default:
          return <Bill />;
      }
    }
    switch (selectedTab) {
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: PALETTE.background }}>
      <CssBaseline />
      <Navbar onProfileOpen={() => setProfileOpen(true)} handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        billSubView={billSubView}
        setBillSubView={setBillSubView}
        billDrawerView={billDrawerView}
        setBillDrawerView={setBillDrawerView}
        billDrawerOpen={billDrawerOpen}
        setBillDrawerOpen={setBillDrawerOpen}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        sx={{
          position: { md: 'fixed' },
          top: { md: 0 },
          left: { md: 0 },
          height: { md: '100vh' },
          zIndex: 1200,
        }}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 1, md: 2 }, bgcolor: 'transparent', boxShadow: 'none' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            {renderContent()}
          </Box>
        </Paper>
        <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      </Box>
    </Box>
  );
};

export default Dashboard; 