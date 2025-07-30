import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import { Spa, TrendingUp } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const PALETTE = {
  moss: '#437057',
  mustard: '#E3DE61',
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const tenantId = currentUser?.uid;
  const [billCount, setBillCount] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);

  // Fetch all bills and calculate total amount and unique customers
  useEffect(() => {
    if (!tenantId) return;
    const unsub = onSnapshot(collection(db, 'tenants', tenantId, 'bills'), (snapshot) => {
      setBillCount(snapshot.size);
      let total = 0;
      const customerNames = new Set();
      snapshot.docs.forEach(docSnap => {
        const rec = docSnap.data();
        // Use saved total if present, otherwise calculate
        let billTotal = rec.total;
        if (typeof billTotal === 'undefined') {
          const subtotal = (rec.services || []).reduce((sum, row) => {
            const rate = parseFloat(row.rate) || 0;
            const qty = parseFloat(row.quantity) || 0;
            return sum + rate * qty;
          }, 0);
          const discountPercent = parseFloat(rec.discount) || 0;
          const discountAmount = subtotal * (discountPercent / 100);
          const cgstAmount = subtotal * (parseFloat(rec.cgst) || 0) / 100;
          const sgstAmount = subtotal * (parseFloat(rec.sgst) || 0) / 100;
          billTotal = subtotal - discountAmount + cgstAmount + sgstAmount;
        }
        total += billTotal;
        if (rec.client?.name) customerNames.add(rec.client.name.trim().toLowerCase());
      });
      setTotalBillAmount(total);
      setUniqueCustomerCount(customerNames.size);
    });
    return () => unsub();
  }, [tenantId]);

  // Dashboard summary cards
  const widgets = [
    {
      icon: <ReceiptLongIcon fontSize="large" />, label: 'Total Bills', value: billCount,
      color: PALETTE.moss,
    },
    {
      icon: <TrendingUp fontSize="large" />, label: 'Total Amount (INR)', value: `₹ ${totalBillAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      color: PALETTE.mustard,
    },
    {
      icon: <PeopleIcon fontSize="large" />, label: 'Unique Customers', value: uniqueCustomerCount,
      color: PALETTE.moss,
    },
    {
      icon: <Spa fontSize="large" />, label: 'Services', value: '18',
      color: PALETTE.moss,
    },
  ];

  return (
    <>
      {/* Dashboard summary cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {widgets.map((w, idx) => (
          <Grid item xs={12} sm={6} md={3} key={w.label}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: w.color, color: '#fff', boxShadow: 3 }}>
              {w.icon}
              <Box>
                <Typography variant="subtitle2">{w.label}</Typography>
                <Typography variant="h6">{w.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Dashboard; 