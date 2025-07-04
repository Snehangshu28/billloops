import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Container,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  Business,
  Store,
  Restaurant,
  LocalHospital,
  School,
  Build,
  Spa,
} from '@mui/icons-material';
import { useBusiness } from '../../context/BusinessContext';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'Beauty & Wellness', icon: <Spa fontSize="large" /> },
];

const subcategories = {
  'Beauty & Wellness': [
    'Salons / Parlours',
    'Spas & Wellness Centers',
    'Tattoo Studios',
    'Ayurvedic Clinics',
    'Massage Centers',
    'Nail Studios',
    'Skincare Clinics',
    'Hair Product Stores',
  ],
  Retail: ['Grocery', 'Clothing', 'Electronics', 'Pharmacy'],
  Restaurant: ['Cafe', 'Fine Dining', 'Fast Food', 'Bakery'],
  Healthcare: ['Clinic', 'Dental', 'Pharmacy', 'Lab'],
  Education: ['School', 'Coaching', 'College', 'Library'],
  Manufacturing: ['Factory', 'Workshop', 'Assembly', 'Packaging'],
  Other: ['Consulting', 'IT', 'Freelance', 'Other'],
};

const steps = ['Select Category', 'Select Subcategories', 'Business Info'];

const initialForm = {
  name: '',
  address: '',
  phone: '',
  email: '',
};

const Onboarding = () => {
  const { data, updateOnboarding } = useBusiness();
  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState(data.onboarding.category || '');
  const [selectedSubs, setSelectedSubs] = useState(
    data.onboarding.subcategories || []
  );
  const [form, setForm] = useState(data.onboarding.businessInfo || initialForm);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    setCategory(data.onboarding.category || '');
    setSelectedSubs(data.onboarding.subcategories || []);
    setForm(data.onboarding.businessInfo || initialForm);
  }, [data.onboarding]);

  // Step 1: Category selection
  const handleCategorySelect = (cat) => setCategory(cat);

  // Step 2: Subcategory selection
  const handleSubToggle = (sub) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  // Step 3: Form input
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  const handleFinish = () => {
    updateOnboarding({
      category,
      subcategories: selectedSubs,
      businessInfo: form,
    });
    navigate('/signup', {
      state: {
        category,
        subcategories: selectedSubs,
        businessInfo: form,
      },
    });
  };

  // Step content
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2} justifyContent="center">
            {categories.map((cat) => (
              <Grid item xs={6} sm={4} md={2} key={cat.label}>
                <Card
                  variant={category === cat.label ? 'elevation' : 'outlined'}
                  sx={{
                    border:
                      category === cat.label
                        ? '2px solid #1976d2'
                        : '1px solid #ccc',
                    boxShadow: category === cat.label ? 4 : 0,
                    transition: '0.2s',
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCategorySelect(cat.label)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      {cat.icon}
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {cat.label}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2} justifyContent="center">
            {(subcategories[category] || []).map((sub) => (
              <Grid item xs={12} sm={6} md={3} key={sub}>
                <Card
                  variant={
                    selectedSubs.includes(sub) ? 'elevation' : 'outlined'
                  }
                  sx={{
                    border: selectedSubs.includes(sub)
                      ? '2px solid #1976d2'
                      : '1px solid #ccc',
                    boxShadow: selectedSubs.includes(sub) ? 4 : 0,
                    transition: '0.2s',
                  }}
                >
                  <CardActionArea onClick={() => handleSubToggle(sub)}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={selectedSubs.includes(sub)}
                        sx={{ pointerEvents: 'none' }}
                        color="primary"
                      />
                      <Typography variant="subtitle1">{sub}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Box
            component="form"
            sx={{ mt: 2, width: isMobile ? '100%' : 400, mx: 'auto' }}
          >
            <TextField
              label="Business Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
              type="email"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  // Button enable/disable logic
  const canProceed = () => {
    if (activeStep === 0) return !!category;
    if (activeStep === 1) return selectedSubs.length > 0;
    if (activeStep === 2)
      return (
        (form.name || '').trim() &&
        (form.address || '').trim() &&
        (form.phone || '').trim() &&
        (form.email || '').trim()
      );
    return false;
  };

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 2 : 6 }}>
      <Box
        sx={{
          maxWidth: 700,
          mx: 'auto',
          bgcolor: '#fff',
          p: isMobile ? 2 : 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStep()}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={!canProceed()}
              onClick={handleFinish}
            >
              Finish
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Onboarding;
