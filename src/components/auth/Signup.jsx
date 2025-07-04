import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
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

const PALETTE = {
  forest: '#2F5249',
  moss: '#437057',
  olive: '#97B067',
  mustard: '#E3DE61',
  background: '#F8F9F6',
};

const FONT = { fontFamily: 'Poppins, sans-serif' };

const countries = [
  'West Bengal',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Other',
];

export default function Signup({ hideReview }) {
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('West Bengal');
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState({
    company: '',
    email: '',
    phone: '',
    password: '',
  });
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signup({
        company: form.company,
        email: form.email,
        phone: form.phone,
        password: form.password,
        country,
      });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: PALETTE.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...FONT,
      }}
    >
      <Container maxWidth="sm">
        {/* {!hideReview && (
          <Box mb={4}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.secondary', textAlign: 'center', fontSize: '1.05rem', ...FONT }}>
              "Try Billoops once, and you'll find it easy to use, <span style={{color:'#CBC3E3'}}>simple to integrate</span>, and a true value for the money!"
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mt={2} mb={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#e0e0e0',
                  mr: 2,
                  overflow: 'hidden',
                }}
                component="span"
              >
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Director"
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.95rem', ...FONT }}>Varun Deshpande</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', ...FONT }}>Director, JioHaptik</Typography>
              </Box>
            </Box>
          </Box>
        )} */}
        <Box
          sx={{
            width: '100%',
            mx: 'auto',
            bgcolor: '#fff',
            p: 4,
            borderRadius: 3,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: PALETTE.forest,
              textAlign: 'center',
              mb: 1,
              ...FONT,
            }}
          >
            Billoops
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: PALETTE.forest,
              textAlign: 'center',
              mb: 2,
              ...FONT,
            }}
          >
            Let's get started
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Company Name"
              name="company"
              value={form.company}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              InputLabelProps={{
                style: { color: PALETTE.forest, fontSize: 16, ...FONT },
              }}
              inputProps={{ style: { ...FONT, fontSize: 16 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  borderRadius: 2,
                  '& fieldset': { borderColor: PALETTE.moss },
                  '&:hover fieldset': { borderColor: PALETTE.forest },
                  '&.Mui-focused fieldset': { borderColor: PALETTE.moss },
                  transition: 'all 0.3s',
                },
                mb: 1,
              }}
            />
            <TextField
              label="Email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
              required
              variant="outlined"
              InputLabelProps={{
                style: { color: PALETTE.forest, fontSize: 16, ...FONT },
              }}
              inputProps={{ style: { ...FONT, fontSize: 16 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  borderRadius: 2,
                  '& fieldset': { borderColor: PALETTE.moss },
                  '&:hover fieldset': { borderColor: PALETTE.forest },
                  '&.Mui-focused fieldset': { borderColor: PALETTE.moss },
                  transition: 'all 0.3s',
                },
                mb: 1,
              }}
            />
            <TextField
              label="Phone number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              fullWidth
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
                style: { ...FONT, fontSize: 16 },
              }}
              InputLabelProps={{
                style: { color: PALETTE.forest, fontSize: 16, ...FONT },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  borderRadius: 2,
                  '& fieldset': { borderColor: PALETTE.moss },
                  '&:hover fieldset': { borderColor: PALETTE.forest },
                  '&.Mui-focused fieldset': { borderColor: PALETTE.moss },
                  transition: 'all 0.3s',
                },
                mb: 1,
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
              variant="outlined"
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
                style: { ...FONT, fontSize: 16 },
              }}
              InputLabelProps={{
                style: { color: PALETTE.forest, fontSize: 16, ...FONT },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Poppins',
                  borderRadius: 2,
                  '& fieldset': { borderColor: PALETTE.moss },
                  '&:hover fieldset': { borderColor: PALETTE.forest },
                  '&.Mui-focused fieldset': { borderColor: PALETTE.moss },
                  transition: 'all 0.3s',
                },
                mb: 1,
              }}
            />
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              margin="normal"
              sx={{
                mt: 2,
                mb: 1,
                ...FONT,
                fontSize: 16,
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: PALETTE.moss,
                },
              }}
              inputProps={{ style: { ...FONT, fontSize: 16 } }}
            >
              {[
                'West Bengal',
                'Maharashtra',
                'Delhi',
                'Karnataka',
                'Tamil Nadu',
                'Other',
              ].map((c) => (
                <MenuItem key={c} value={c} sx={{ ...FONT, fontSize: 16 }}>
                  {c}
                </MenuItem>
              ))}
            </Select>
            <Typography
              sx={{ fontSize: 14, color: PALETTE.forest, mb: 1, ...FONT }}
            >
              Your data will be in INDIA data center.{' '}
              <a
                href="#"
                style={{ color: PALETTE.moss, textDecoration: 'underline' }}
              >
                Change Country
              </a>
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  required
                  sx={{ color: PALETTE.moss }}
                />
              }
              label={
                <span style={{ fontSize: 14, color: PALETTE.forest, ...FONT }}>
                  I agree to the{' '}
                  <a
                    href="#"
                    style={{
                      color: PALETTE.forest,
                      textDecoration: 'underline',
                    }}
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    style={{
                      color: PALETTE.forest,
                      textDecoration: 'underline',
                    }}
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              }
              sx={{ alignItems: 'flex-start', my: 1, ...FONT }}
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
                fontSize: 16,
                background: PALETTE.moss,
                color: '#fff',
                borderRadius: 9999,
                height: 40,
                boxShadow: 'none',
                transition: 'all 0.3s',
                '&:hover': { background: PALETTE.forest },
                ...FONT,
              }}
              disabled={!checked}
            >
              Create your account
            </Button>
            <Button
              fullWidth
              sx={{
                mt: 1,
                mb: 2,
                fontWeight: 600,
                fontSize: 16,
                background: PALETTE.mustard,
                color: '#111',
                borderRadius: 9999,
                height: 40,
                boxShadow: 'none',
                transition: 'all 0.3s',
                '&:hover': { background: '#f7f3b0' },
                ...FONT,
              }}
            >
              Start Free Trial
            </Button>
          </form>
          <Divider sx={{ my: 2, fontSize: 14, ...FONT }}>
            or sign in using
          </Divider>
          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <IconButton sx={{ color: PALETTE.moss }}>
              <Google />
            </IconButton>
            <IconButton sx={{ color: PALETTE.moss }}>
              <LinkedIn />
            </IconButton>
            <IconButton sx={{ color: PALETTE.moss }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: PALETTE.moss }}>
              <Twitter />
            </IconButton>
          </Stack>
          <Typography
            align="center"
            sx={{ fontSize: 14, color: PALETTE.forest, ...FONT }}
          >
            Already have an account?{' '}
            <a
              href="/login"
              style={{
                color: PALETTE.forest,
                fontWeight: 500,
                textDecoration: 'underline',
              }}
            >
              Sign in
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
