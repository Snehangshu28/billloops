import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const dataSummary = [
  { title: 'Balance', value: '$4,800', color: '#0066FF' },
  { title: 'Sales', value: '$4,567', color: '#FF5C93' },
  { title: 'Revenue', value: '$8,600', color: '#FFC93E' },
];

const activityData = [
  { name: 'Online Store', value: 3000, color: '#0066FF' },
  { name: 'Retail', value: 800, color: '#FFC93E' },
  { name: 'Other', value: 900, color: '#FF5C93' },
];

const salesData = [
  { name: 'Jan', thisMonth: 15, lastMonth: 12 },
  { name: 'Feb', thisMonth: 20, lastMonth: 18 },
  { name: 'Mar', thisMonth: 10, lastMonth: 15 },
  { name: 'Apr', thisMonth: 22, lastMonth: 19 },
];

const revenueReport = [
  { month: 'Jan', billCount: 18, billValue: 12 },
  { month: 'Feb', billCount: 22, billValue: 15 },
  { month: 'Mar', billCount: 19, billValue: 13 },
  { month: 'Apr', billCount: 24, billValue: 17 },
];

const topProducts = [
  { name: 'Skeyndor Cleanser', value: 210, percentage: 54 },
  { name: 'Hair Spa Cream', value: 110, percentage: 48 },
];

const Dashboard = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#F5F6FA', minHeight: '100vh' }}>
      <Grid container spacing={3}>

        {/* Summary Cards */}
        {dataSummary.map((item, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ bgcolor: item.color, color: '#fff',  boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ opacity: 0.85 }}>{item.title}</Typography>
                <Typography variant="h4" fontWeight={700} mt={1}>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Activity Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{  boxShadow: 2, minHeight: 300 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Activity</Typography>
              <Box display="flex" justifyContent="center">
                <PieChart width={220} height={220}>
                  <Pie
                    data={activityData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{  boxShadow: 2, minHeight: 300 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Top Products</Typography>
              {topProducts.map((prod, idx) => (
                <Box key={idx} mb={3}>
                  <Typography fontWeight={600}>{prod.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>Value: ${prod.value}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={prod.percentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{  boxShadow: 2, minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Sales Overview</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="thisMonth" stroke="#0066FF" strokeWidth={3} />
                  <Line type="monotone" dataKey="lastMonth" stroke="#FF5C93" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Payment */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{  boxShadow: 2, textAlign: 'center', py: 5, }}>
            <Typography variant="h3" fontWeight={700}>70%</Typography>
            <Typography mt={1} fontWeight={500}>Average Payment</Typography>
          </Card>
        </Grid>

        {/* Revenue Report */}
        <Grid item xs={12}>
          <Card sx={{  boxShadow: 2, minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Revenue Report</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueReport}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="billCount" fill="#00C49F" />
                  <Bar dataKey="billValue" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
