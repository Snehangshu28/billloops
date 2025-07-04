import React, { useState } from 'react';
import {
  Box, Grid, Paper, Typography, Tabs, Tab, Button, TextField, MenuItem, Select, InputLabel, FormControl, Stack, Divider, useTheme
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Dummy Data
const summary = {
  todaySales: 12500,
  bookings: 34,
  topService: 'Haircut',
  lowStock: 3,
};
const inventory = [
  { name: 'Shampoo', stock: 2, min: 5, max: 50, turnover: 4.2, used: 30, purchased: 40 },
  { name: 'Conditioner', stock: 0, min: 5, max: 30, turnover: 2.1, used: 20, purchased: 25 },
  { name: 'Hair Gel', stock: 60, min: 5, max: 40, turnover: 1.5, used: 10, purchased: 70 },
  { name: 'Serum', stock: 8, min: 5, max: 20, turnover: 3.0, used: 15, purchased: 20 },
];
const stockTrend = [
  { date: '2024-06-01', used: 5, purchased: 10 },
  { date: '2024-06-02', used: 7, purchased: 8 },
  { date: '2024-06-03', used: 6, purchased: 12 },
  { date: '2024-06-04', used: 8, purchased: 7 },
  { date: '2024-06-05', used: 9, purchased: 10 },
];
const services = [
  { name: 'Haircut', freq: 120, revenue: 6000, addOns: 40 },
  { name: 'Facial', freq: 80, revenue: 8000, addOns: 20 },
  { name: 'Shave', freq: 60, revenue: 3000, addOns: 10 },
  { name: 'Spa', freq: 30, revenue: 9000, addOns: 5 },
];
const addOns = [
  { name: 'Head Massage', freq: 50 },
  { name: 'Beard Trim', freq: 30 },
  { name: 'Hair Wash', freq: 20 },
];
const servicePie = [
  { name: 'Haircut', value: 6000 },
  { name: 'Facial', value: 8000 },
  { name: 'Shave', value: 3000 },
  { name: 'Spa', value: 9000 },
];
const salesMonthly = [
  { month: 'Jan', sales: 20000, bills: 120, avg: 167 },
  { month: 'Feb', sales: 25000, bills: 140, avg: 179 },
  { month: 'Mar', sales: 22000, bills: 130, avg: 169 },
  { month: 'Apr', sales: 27000, bills: 150, avg: 180 },
  { month: 'May', sales: 30000, bills: 160, avg: 188 },
  { month: 'Jun', sales: 32000, bills: 170, avg: 188 },
];
const staff = [
  { name: 'Amit', services: 40, revenue: 12000, avgTime: 35, rating: 4.7 },
  { name: 'Priya', services: 38, revenue: 11000, avgTime: 32, rating: 4.8 },
  { name: 'Rahul', services: 30, revenue: 9000, avgTime: 40, rating: 4.5 },
];
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

function SummaryCards() {
  const theme = useTheme();
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
          <MonetizationOnIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2">Today's Sales</Typography>
            <Typography variant="h6">₹{summary.todaySales.toLocaleString()}</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <EventAvailableIcon color="secondary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2">Bookings</Typography>
            <Typography variant="h6">{summary.bookings}</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon color="success" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2">Top Service</Typography>
            <Typography variant="h6">{summary.topService}</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningAmberIcon color="error" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2">Low Stock Alerts</Typography>
            <Typography variant="h6">{summary.lowStock}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

function InventoryTab() {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>Stock Summary</Typography>
            <Grid container spacing={1}>
              {inventory.map((item, idx) => (
                <Grid item xs={12} sm={6} key={item.name}>
                  <Paper sx={{ p: 1.5, bgcolor: item.stock === 0 ? 'error.light' : item.stock < item.min ? 'warning.light' : item.stock > item.max ? 'info.light' : 'background.paper', color: item.stock === 0 ? 'error.dark' : 'inherit', mb: 1 }}>
                    <Typography fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2">Stock: {item.stock}</Typography>
                    <Typography variant="caption">
                      {item.stock === 0 ? 'Out of Stock' : item.stock < item.min ? 'Low Stock' : item.stock > item.max ? 'Overstocked' : 'OK'}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>Inventory Turnover Rate</Typography>
            <Grid container spacing={1}>
              {inventory.map(item => (
                <Grid item xs={6} key={item.name}>
                  <Typography fontWeight={500}>{item.name}</Typography>
                  <Typography variant="body2">{item.turnover} times/month</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>Stock Usage Trends</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stockTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="used" stroke="#1976d2" />
                <Line type="monotone" dataKey="purchased" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Purchase vs Usage</Typography>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Purchased</th>
                  <th>Used</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.purchased}</td>
                    <td>{item.used}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function TopServicesTab() {
  const [sortBy, setSortBy] = useState('freq');
  const sorted = [...services].sort((a, b) => b[sortBy] - a[sortBy]);
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Top Services</Typography>
              <FormControl size="small">
                <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <MenuItem value="freq">By Frequency</MenuItem>
                  <MenuItem value="revenue">By Revenue</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Frequency</th>
                  <th>Revenue</th>
                  <th>Add-ons</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td>{s.freq}</td>
                    <td>₹{s.revenue}</td>
                    <td>{s.addOns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Most Common Add-ons</Typography>
            <ul>
              {addOns.map(a => (
                <li key={a.name}>{a.name} ({a.freq})</li>
              ))}
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" mb={2}>Revenue by Service Type</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={servicePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {servicePie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function MonthlySalesTab() {
  const [range, setRange] = useState([0, salesMonthly.length - 1]);
  const filtered = salesMonthly.slice(range[0], range[1] + 1);
  const growth = filtered.length > 1 ? (((filtered[filtered.length - 1].sales - filtered[0].sales) / filtered[0].sales) * 100).toFixed(1) : 0;
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>Monthly Sales</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" mb={2}>Sales KPIs</Typography>
            <Typography>Total Sales: ₹{filtered.reduce((a, b) => a + b.sales, 0).toLocaleString()}</Typography>
            <Typography>Number of Bills: {filtered.reduce((a, b) => a + b.bills, 0)}</Typography>
            <Typography>Avg Bill Value: ₹{(filtered.reduce((a, b) => a + b.avg, 0) / filtered.length).toFixed(0)}</Typography>
            <Typography>Growth: <span style={{ color: growth >= 0 ? '#388e3c' : '#d32f2f' }}>{growth}%</span></Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Date Range</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                select
                label="From"
                size="small"
                value={range[0]}
                onChange={e => setRange([+e.target.value, range[1]])}
              >
                {salesMonthly.map((m, i) => <MenuItem value={i} key={m.month}>{m.month}</MenuItem>)}
              </TextField>
              <TextField
                select
                label="To"
                size="small"
                value={range[1]}
                onChange={e => setRange([range[0], +e.target.value])}
              >
                {salesMonthly.map((m, i) => <MenuItem value={i} key={m.month}>{m.month}</MenuItem>)}
              </TextField>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function StaffTab() {
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>Staff-wise Sales & Performance</Typography>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Services</th>
              <th>Revenue</th>
              <th>Avg Service Time (min)</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.services}</td>
                <td>₹{s.revenue}</td>
                <td>{s.avgTime}</td>
                <td>{s.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
}

function FiltersExportTab() {
  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" mb={2}>Filters</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField select label="Service Category" size="small" sx={{ minWidth: 180 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="hair">Hair</MenuItem>
            <MenuItem value="skin">Skin</MenuItem>
          </TextField>
          <TextField select label="Product" size="small" sx={{ minWidth: 180 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="shampoo">Shampoo</MenuItem>
            <MenuItem value="gel">Hair Gel</MenuItem>
          </TextField>
          <TextField select label="Staff" size="small" sx={{ minWidth: 180 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="amit">Amit</MenuItem>
            <MenuItem value="priya">Priya</MenuItem>
          </TextField>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>Export Reports</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export CSV</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export Excel</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export PDF</Button>
        </Stack>
      </Paper>
    </Box>
  );
}

const tabLabels = [
  'Inventory Analysis',
  'Top Services',
  'Monthly Sales',
  'Staff-wise Performance',
  'Filters & Export',
];

const Analysis = () => {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', my: 3 }}>
      <SummaryCards />
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          {tabLabels.map((label, idx) => (
            <Tab label={label} key={label} />
          ))}
        </Tabs>
      </Paper>
      <Box>
        {tab === 0 && <InventoryTab />}
        {tab === 1 && <TopServicesTab />}
        {tab === 2 && <MonthlySalesTab />}
        {tab === 3 && <StaffTab />}
        {tab === 4 && <FiltersExportTab />}
      </Box>
    </Box>
  );
};

export default Analysis; 