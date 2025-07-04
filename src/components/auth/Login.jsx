import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  LinkedIn,
  Twitter,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
  background: '#F8F9F6',
  primary: '#437057',
  primaryDark: '#2F5249',
  cta: '#E3DE61',
  ctaText: '#2F5249',
  border: '#437057',
  label: '#437057',
};

const FONT = { fontFamily: 'Poppins, sans-serif' };

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('user-not-found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            bgcolor: '#fff',
            p: 3,
            borderRadius: 3,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={2}
            sx={{
              color: COLORS.primaryDark,
              fontSize: '2rem',
              textAlign: 'center',
              ...FONT,
            }}
          >
            Billoops
          </Typography>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            sx={{ fontSize: '1.15rem', textAlign: 'center', ...FONT }}
          >
            Sign in to your account
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && (
              <Typography
                color="error"
                sx={{
                  mb: 1,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {error}
              </Typography>
            )}
            <TextField
              label="Email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: COLORS.label, ...FONT } }}
              inputProps={{ style: { ...FONT } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  '& fieldset': { borderColor: COLORS.border },
                  '&:hover fieldset': { borderColor: COLORS.primary },
                  '&.Mui-focused fieldset': { borderColor: COLORS.primary },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { ...FONT },
              }}
              InputLabelProps={{ style: { color: COLORS.label, ...FONT } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  '& fieldset': { borderColor: COLORS.border },
                  '&:hover fieldset': { borderColor: COLORS.primary },
                  '&.Mui-focused fieldset': { borderColor: COLORS.primary },
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.remember}
                  onChange={handleChange}
                  name="remember"
                />
              }
              label={
                <span
                  style={{
                    color: COLORS.primary,
                    fontSize: '0.95rem',
                    ...FONT,
                  }}
                >
                  Remember me
                </span>
              }
              sx={{ my: 1, ...FONT }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                mb: 1.5,
                fontWeight: 600,
                fontSize: 15,
                background: COLORS.primary,
                color: '#fff',
                borderRadius: 2,
                '&:hover': { background: COLORS.primaryDark },
                ...FONT,
              }}
              disabled={loading}
            >
              Sign in
            </Button>
          </form>
          <Divider sx={{ my: 2, fontSize: '0.95rem', ...FONT }}>
            or sign in using
          </Divider>
          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <IconButton sx={{ color: COLORS.primary }}>
              <Google />
            </IconButton>
            <IconButton sx={{ color: COLORS.primary }}>
              <LinkedIn />
            </IconButton>
            <IconButton sx={{ color: COLORS.primary }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: COLORS.primary }}>
              <Twitter />
            </IconButton>
          </Stack>
          <Typography
            align="center"
            variant="body2"
            sx={{ fontSize: '0.95rem', color: COLORS.ctaText, ...FONT }}
          >
            Don't have an account?{' '}
            <a
              href="/signup"
              style={{ color: COLORS.ctaText, fontWeight: 500 }}
            >
              Sign up
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
