import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Customer = () => {
  const { currentUser } = useAuth();
  const tenantId = currentUser?.uid;
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // phone: boolean

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    const unsub = onSnapshot(collection(db, 'tenants', tenantId, 'bills'), (snapshot) => {
      setBills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  // Group bills by client phone number
  const customers = {};
  for (const bill of bills) {
    const phone = bill.client?.contact?.trim() || 'Unknown';
    if (!customers[phone]) customers[phone] = [];
    customers[phone].push(bill);
  }

  const handleExpandClick = (phone) => {
    setExpanded((prev) => ({ ...prev, [phone]: !prev[phone] }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#F5F6FA', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Customers</Typography>
      <Grid container spacing={3}>
        {Object.entries(customers).map(([phone, bills]) => {
          // Aggregate all services and products for this customer
          const allServices = bills.flatMap(bill => bill.services || []);
          const allProducts = bills.flatMap(bill => bill.products || []);
          // Get all purchase dates
          const allDates = bills.map(bill => bill.client?.date).filter(Boolean);
          // Calculate total product and service amounts
          const totalProductAmount = allProducts.reduce((sum, p) => sum + ((parseFloat(p.rate) || 0) * (parseFloat(p.quantity) || 0)), 0);
          const totalServiceAmount = allServices.reduce((sum, s) => sum + ((parseFloat(s.rate) || 0) * (parseFloat(s.quantity) || 0)), 0);
          // Get customer name (from first bill)
          const customerName = bills[0]?.client?.name || 'Unknown';
          return (
            <Grid item xs={12} sm={6} md={4} key={phone}>
              <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{customerName}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">Phone: {phone}</Typography>
                  <Divider sx={{ mb: 1, mt: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Purchase Dates:</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                    {allDates.length > 0 ? allDates.map((date, i) => (
                      <Chip key={i} label={date} size="small" />
                    )) : <Typography variant="body2">No date info</Typography>}
                  </Stack>
                  <Typography variant="subtitle2" color="text.secondary">Services Taken:</Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {allServices.length > 0 ? allServices.map((s, i) => (
                      <li key={i}>{s.description} (x{s.quantity}) - ₹{s.rate}</li>
                    )) : <li>No services</li>}
                  </ul>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Products Bought:</Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {allProducts.length > 0 ? allProducts.map((p, i) => (
                      <li key={i}>{p.description || p.stock} (x{p.quantity}) - ₹{p.rate}</li>
                    )) : <li>No products</li>}
                  </ul>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={2} mb={1}>
                    <Typography variant="body2" fontWeight={600}>Total Product Amount: <span style={{ color: '#1976d2' }}>₹{totalProductAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></Typography>
                    <Typography variant="body2" fontWeight={600}>Total Service Amount: <span style={{ color: '#388e3c' }}>₹{totalServiceAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></Typography>
                  </Stack>
                  {bills.length > 1 && (
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={expanded[phone] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={() => handleExpandClick(phone)}
                      sx={{ mt: 1 }}
                    >
                      View Bill
                    </Button>
                  )}
                  <Collapse in={!!expanded[phone]} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Bills for {phone}:</Typography>
                    <Stack spacing={1}>
                      {bills.map((bill, idx) => {
                        // Calculate total (subtotal - discount + cgst + sgst)
                        const subtotal = (bill.services || []).reduce((sum, row) => sum + ((parseFloat(row.rate) || 0) * (parseFloat(row.quantity) || 0)), 0) +
                          (bill.products || []).reduce((sum, row) => sum + ((parseFloat(row.rate) || 0) * (parseFloat(row.quantity) || 0)), 0);
                        const discountPercent = parseFloat(bill.discount) || 0;
                        const discountAmount = subtotal * (discountPercent / 100);
                        const cgstAmount = subtotal * (parseFloat(bill.cgst) || 0) / 100;
                        const sgstAmount = subtotal * (parseFloat(bill.sgst) || 0) / 100;
                        const total = subtotal - discountAmount + cgstAmount + sgstAmount;
                        return (
                          <Box key={bill.id || idx} sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight={600}>Invoice #: {bill.client?.invoice || 'N/A'}</Typography>
                            <Typography variant="body2">Date: {bill.client?.date || 'N/A'}</Typography>
                            <Typography variant="body2">Total (incl. SGST+CGST): <span style={{ color: '#1976d2', fontWeight: 700 }}>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        {Object.keys(customers).length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" align="center">No customers found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Customer;
