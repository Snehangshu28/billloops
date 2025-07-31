import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';

const sampleOffers = [
  { title: 'Flat 10% off', description: 'Get 10% off on your next purchase above ₹500.' },
  { title: 'Free Shipping', description: 'Enjoy free shipping on orders over ₹999.' },
  { title: 'Refer & Earn', description: 'Refer a friend and earn ₹100 wallet cash.' },
];

function Offer() {
  const [form, setForm] = useState({
    contactType: '',
    contactValue: '',
    selectedOffer: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOffer = () => {
    console.log('Sending offer to:', form);
    alert('Offer sent successfully!');
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Send Offer to Customer
      </Typography>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Contact Type (Phone/WhatsApp/Email)"
            name="contactType"
            fullWidth
            value={form.contactType}
            onChange={handleChange}
            placeholder="e.g. WhatsApp"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Contact Info"
            name="contactValue"
            fullWidth
            value={form.contactValue}
            onChange={handleChange}
            placeholder="Enter phone number or email"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Offer Title"
            name="selectedOffer"
            fullWidth
            value={form.selectedOffer}
            onChange={handleChange}
            placeholder="e.g. Flat 10% off"
          />
        </Grid>
        <Grid item xs={12} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSendOffer}>
            Send Offer
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Available Offers
      </Typography>

      <Grid container spacing={2}>
        {sampleOffers.map((offer, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  {offer.title}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {offer.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Offer;
