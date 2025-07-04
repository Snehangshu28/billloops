import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Spa } from '@mui/icons-material';
import { useBusiness } from '../../context/BusinessContext';
import Signup from '../auth/Signup';

const PALETTE = {
  forest: '#2F5249',
  moss: '#437057',
  olive: '#97B067',
  mustard: '#E3DE61',
};

const FONT = { fontFamily: 'Poppins, sans-serif' };

const categories = [
  { label: 'Beauty & Wellness', icon: <Spa sx={{ fontSize: 28 }} /> },
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
};

const Onboarding = () => {
  const { data } = useBusiness();
  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState(data.onboarding.category || '');
  const [selectedSubs, setSelectedSubs] = useState(
    data.onboarding.subcategories || []
  );
  const isMobile = useMediaQuery('(max-width:600px)');

  // Step 1: Category selection
  const handleCategorySelect = (cat) => setCategory(cat);

  // Step 2: Subcategory selection
  const handleSubToggle = (sub) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  // Step content
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 600, color: PALETTE.forest, mb: 3, ...FONT }}>
              Choose the Business Category
            </Typography>
            <Grid container spacing={0} justifyContent="center">
              {categories.map((cat) => (
                <Grid item xs={12} sm={6} md={4} key={cat.label} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    sx={{
                      background: PALETTE.olive,
                      border: `2px solid ${PALETTE.moss}`,
                      borderRadius: 2,
                      minWidth: 220,
                      minHeight: 120,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.04)', boxShadow: '0 4px 24px rgba(67,112,87,0.10)' },
                    }}
                  >
                    <CardActionArea onClick={() => handleCategorySelect(cat.label)} sx={{ p: 2, borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        {cat.icon}
                        <Typography sx={{ fontSize: 18, fontWeight: 500, color: PALETTE.forest, mt: 1, ...FONT }}>
                          {cat.label}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 600, color: PALETTE.forest, mb: 3, ...FONT }}>
              Choose the Business Sub-Category
            </Typography>
            <Grid container spacing={0} justifyContent="center" sx={{ gap: '24px', flexWrap: 'wrap' }}>
              {(subcategories[category] || []).map((sub) => {
                const selected = selectedSubs.includes(sub);
                return (
                  <Grid item key={sub} sx={{ width: 240, height: 100, m: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Card
                      sx={{
                        width: 240,
                        height: 100,
                        background: selected ? PALETTE.olive : '#fff',
                        border: selected ? `2px solid ${PALETTE.moss}` : `1px solid ${PALETTE.moss}`,
                        borderRadius: 2,
                        boxShadow: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': { transform: 'scale(1.04)', background: PALETTE.olive },
                      }}
                    >
                      <CardActionArea onClick={() => handleSubToggle(sub)} sx={{ borderRadius: 2, width: '100%', height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: 18, fontWeight: 500, color: PALETTE.forest, ...FONT }}>{sub}</Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Signup hideReview />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (activeStep === 0) return !!category;
    if (activeStep === 1) return selectedSubs.length > 0;
    return true;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#FFFBDE', py: 6, ...FONT }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>{renderStep()}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined" sx={{
              color: PALETTE.moss, borderColor: PALETTE.moss, background: '#fff',
              fontWeight: 500, fontSize: 16, borderRadius: 9999, px: 4, py: 1, transition: 'all 0.3s',
              '&:hover': { background: PALETTE.olive, color: PALETTE.forest }, ...FONT
            }}>
              Back
            </Button>
          )}
          {activeStep < 2 && (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                background: PALETTE.moss, color: '#fff', fontWeight: 500, fontSize: 16, borderRadius: 9999, px: 6, py: 1.5,
                boxShadow: 'none', transition: 'all 0.3s',
                '&:hover': { background: PALETTE.forest, color: '#fff', transform: 'scale(1.04)' }, ...FONT
              }}
              disabled={!canProceed()}
            >
              Next
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Onboarding;
