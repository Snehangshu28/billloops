import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const PALETTE = {
  forest: '#2F5249',
  olive: '#97B067',
  moss: '#437057',
  card: '#fff',
  background: '#FFFBDE',
};
const FONT = { fontFamily: 'Poppins, sans-serif' };
const drawerWidth = 220;

const Navbar = ({ onProfileOpen, handleDrawerToggle, isMobile }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/login'); // Assuming you have a Navigate function to redirect
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: PALETTE.card,
        color: PALETTE.forest,
        boxShadow: 2,
        borderBottom: `1px solid ${PALETTE.background}`,
        backgroundImage: 'none',
        ...FONT,
      }}
      elevation={0}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 700,
            letterSpacing: 1,
            color: PALETTE.forest,
            ...FONT,
          }}
        >
          Billoops
        </Typography>
        <IconButton
          sx={{
            ml: 2,
            bgcolor: PALETTE.olive,
            color: '#fff',
            '&:hover': { bgcolor: PALETTE.moss },
          }}
          onClick={onProfileOpen}
        >
          <Avatar alt="Profile" />
        </IconButton>
        <Button
          variant="contained"
          color="error"
          sx={{
            ml: 2,
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#b71c1c' },
            textTransform: 'none',
            fontWeight: 600,
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
