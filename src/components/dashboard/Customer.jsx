import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useBusiness } from '../../context/BusinessContext';

const COLORS = {
  background: '#F8F9F6',
  card: '#fff',
  primary: '#437057',
  primaryDark: '#2F5249',
  accent: '#E3DE61',
  text: '#2F5249',
  shadow: '0 4px 16px rgba(67,112,87,0.08)',
};
const FONT = { fontFamily: 'Poppins, sans-serif' };

const Customer = () => {
  const { data } = useBusiness();
  // Assume data.bills is an array of all bills with client info
  const bills = data.allBills || [];

  // Aggregate customer frequency
  const customerStats = useMemo(() => {
    const freq = {};
    bills.forEach(bill => {
      const name = bill.client?.name || 'Unknown';
      if (!freq[name]) freq[name] = { count: 0, contact: bill.client?.contact || '', name };
      freq[name].count += 1;
    });
    return Object.values(freq).sort((a, b) => b.count - a.count);
  }, [bills]);

  // Top 50 customers
  const topCustomers = customerStats.slice(0, 50);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleToggle = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSend = () => {
    // Here you would integrate with an SMS/email API
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 3 }}>
      <Typography variant="h4" gutterBottom>Customer Analysis</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Top 50 Customers (by frequency)</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topCustomers} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count">
              {topCustomers.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Select Customers to Send Offer</Typography>
        <List dense sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          {topCustomers.map((cust, idx) => (
            <ListItem key={cust.name} secondaryAction={
              <Checkbox
                edge="end"
                onChange={() => handleToggle(cust.name)}
                checked={selected.includes(cust.name)}
                sx={{ color: COLORS[idx % COLORS.length] }}
              />
            }>
              <ListItemText
                primary={<span style={{ color: COLORS[idx % COLORS.length], fontWeight: 500 }}>{cust.name}</span>}
                secondary={`Contact: ${cust.contact || 'N/A'} | Visits: ${cust.count}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Offer Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={selected.length === 0 || !message}
            onClick={handleSend}
          >
            Send Message
          </Button>
        </Stack>
        {sent && <Typography color="success.main" sx={{ mt: 2 }}>Message sent to selected customers!</Typography>}
      </Paper>
    </Box>
  );
};

export default Customer; 