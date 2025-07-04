import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const businessDetails = location.state || {};
  const [businessName, setBusinessName] = useState(
    businessDetails.businessInfo?.name || ''
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Check for duplicate email or phone in Firestore
      const tenantsRef = collection(db, 'tenants');
      // Check email
      const qEmail = query(tenantsRef, where('ownerEmail', '==', email));
      const emailSnapshot = await getDocs(qEmail);
      if (!emailSnapshot.empty) {
        setError('Email is already registered. Please use a different email.');
        setLoading(false);
        return;
      }
      // Check phone (from businessDetails or businessName form)
      const phoneToCheck = businessDetails.businessInfo?.phone || '';
      if (phoneToCheck) {
        const qPhone = query(
          tenantsRef,
          where('businessInfo.phone', '==', phoneToCheck)
        );
        const phoneSnapshot = await getDocs(qPhone);
        if (!phoneSnapshot.empty) {
          setError(
            'Phone number is already registered. Please use a different phone number.'
          );
          setLoading(false);
          return;
        }
      }
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Create tenant in Firestore
      const tenantId = user.uid;
      await setDoc(doc(db, 'tenants', tenantId), {
        businessName: businessName || businessDetails.businessInfo?.name || '',
        ownerEmail: email,
        ownerUid: user.uid,
        createdAt: new Date(),
        // Save extra business details if available
        category: businessDetails.category || '',
        subcategories: businessDetails.subcategories || [],
        businessInfo: businessDetails.businessInfo || {},
      });
      setSuccess('Signup successful! You can now log in.');
      setBusinessName('');
      setEmail('');
      setPassword('');
      // Navigate to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up Your Business
        </Typography>
        {(!businessDetails.businessInfo || !businessDetails.category) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please complete onboarding to provide business details.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
