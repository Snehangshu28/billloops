import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Stack,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useBusiness } from '../../context/BusinessContext';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const initialEmployee = {
  name: '',
  contact: '',
  employeeId: '',
  joiningDate: '',
  biometric: '',
  address: '',
};

// Simulated DB data for check-in/out, leave, salary
const getEmployeeStatus = (employeeId) => {
  // Simulate with random/fixed data
  return {
    checkinHistory: [
      { date: '2024-06-01', checkin: '09:00', checkout: '18:00' },
      { date: '2024-06-02', checkin: '09:10', checkout: '18:05' },
      { date: '2024-06-03', checkin: '09:05', checkout: '17:55' },
    ],
    leaveBalance: Math.floor(Math.random() * 10) + 5,
  };
};

const Employee = () => {
  const { data, updateEmployees } = useBusiness();
  const [employees, setEmployees] = useState(data.employees || []);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState(initialEmployee);
  const [biometricFile, setBiometricFile] = useState(null);
  const [activeTab, setActiveTab] = useState('add');

  // Employee Analysis date range state
  const [rangeType, setRangeType] = useState('monthly');
  const [customStart, setCustomStart] = useState(new Date());
  const [customEnd, setCustomEnd] = useState(new Date());
  const [dateRange, setDateRange] = useState({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

  useEffect(() => {
    setEmployees(data.employees || []);
  }, [data.employees]);

  useEffect(() => {
    // Update dateRange based on rangeType
    const today = new Date();
    if (rangeType === 'monthly') {
      setDateRange({ start: startOfMonth(today), end: endOfMonth(today) });
    } else if (rangeType === 'weekly') {
      setDateRange({ start: startOfWeek(today), end: endOfWeek(today) });
    } else if (rangeType === 'yearly') {
      setDateRange({ start: startOfYear(today), end: endOfYear(today) });
    } else if (rangeType === 'custom') {
      setDateRange({ start: customStart, end: customEnd });
    }
  }, [rangeType, customStart, customEnd]);

  const handleOpen = (idx = null) => {
    setEditIdx(idx);
    if (idx !== null) {
      setForm(employees[idx]);
      setBiometricFile(null);
    } else {
      setForm(initialEmployee);
      setBiometricFile(null);
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm(initialEmployee);
    setEditIdx(null);
    setBiometricFile(null);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setBiometricFile(e.target.files[0]);
    setForm({ ...form, biometric: e.target.files[0]?.name || '' });
  };
  const handleSave = () => {
    let updated;
    let newForm = { ...form };
    if (biometricFile) {
      newForm.biometric = biometricFile.name; // Simulate file upload
    }
    if (editIdx !== null) {
      updated = employees.map((e, i) => (i === editIdx ? newForm : e));
    } else {
      updated = [...employees, newForm];
    }
    setEmployees(updated);
    updateEmployees(updated);
    handleClose();
  };
  const handleDelete = (idx) => {
    const updated = employees.filter((_, i) => i !== idx);
    setEmployees(updated);
    updateEmployees(updated);
  };

  // Filter check-in history by date range
  const filterCheckinHistory = (history) => {
    return history.filter((rec) => {
      const d = new Date(rec.date);
      return d >= dateRange.start && d <= dateRange.end;
    });
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', my: 3, bgcolor: '#f7f9fc', p: { xs: 1, md: 3 }, borderRadius: 4 }}>
      {/* Tab Buttons */}
      <Stack direction="row" spacing={2} mb={3} justifyContent="center">
        <Button
          variant={activeTab === 'add' ? 'contained' : 'outlined'}
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
          onClick={() => setActiveTab('add')}
        >
          Add Employee Details
        </Button>
        <Button
          variant={activeTab === 'manage' ? 'contained' : 'outlined'}
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
          onClick={() => setActiveTab('manage')}
        >
          Manage Employee
        </Button>
        <Button
          variant={activeTab === 'analysis' ? 'contained' : 'outlined'}
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
          onClick={() => setActiveTab('analysis')}
        >
          Employee Analysis
        </Button>
      </Stack>

      {/* 1. Add Employee Details */}
      {activeTab === 'add' && (
        <Paper sx={{ p: { xs: 2, md: 5 }, mb: 4, boxShadow: 3, borderRadius: 4 }} elevation={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={700}>Add Employee Details</Typography>
            <Button variant="contained" startIcon={<AddIcon />} size="large" sx={{ borderRadius: 2, fontWeight: 600 }} onClick={() => handleOpen()}>
              Add Employee
            </Button>
          </Stack>
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, boxShadow: 6 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>{editIdx !== null ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  variant="filled"
                  required
                />
                <TextField
                  label="Contact Number"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  fullWidth
                  variant="filled"
                  type="tel"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  required
                />
                <TextField
                  label="Employee ID"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  fullWidth
                  variant="filled"
                  required
                />
                <TextField
                  label="Joining Date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  fullWidth
                  variant="filled"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Box>
                  <Typography variant="body2" mb={1}>Biometric (File Upload or Unique ID)</Typography>
                  <input
                    type="file"
                    accept="*"
                    onChange={handleFileChange}
                    style={{ marginBottom: 8 }}
                  />
                  <TextField
                    label="Or Enter Biometric ID"
                    name="biometric"
                    value={form.biometric}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                  />
                </Box>
                <TextField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  variant="filled"
                  multiline
                  minRows={2}
                  required
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSave}
                variant="contained"
                size="large"
                sx={{ borderRadius: 2, fontWeight: 600 }}
                disabled={
                  !form.name || !form.contact || !form.employeeId || !form.joiningDate || !form.biometric || !form.address
                }
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}

      {/* 2. Manage Employee */}
      {activeTab === 'manage' && (
        <Paper sx={{ p: { xs: 2, md: 5 }, mb: 4, boxShadow: 3, borderRadius: 4 }} elevation={2}>
          <Typography variant="h5" fontWeight={700} mb={2}>Manage Employee</Typography>
          <TableContainer sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f0f3fa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Joining Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Biometric</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Address</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No employees added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        bgcolor: idx % 2 === 0 ? '#f7f9fc' : '#fff',
                        '&:hover': { bgcolor: '#e3e9f7' },
                        transition: 'background 0.2s',
                      }}
                    >
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.contact}</TableCell>
                      <TableCell>{emp.employeeId}</TableCell>
                      <TableCell>{emp.joiningDate}</TableCell>
                      <TableCell>{emp.biometric}</TableCell>
                      <TableCell>{emp.address}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleOpen(idx)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* 3. Employee Analysis */}
      {activeTab === 'analysis' && (
        <Paper sx={{ p: { xs: 2, md: 5 }, boxShadow: 3, borderRadius: 4 }} elevation={2}>
          <Typography variant="h5" fontWeight={700} mb={2}>Employee Analysis</Typography>
          {/* Date Range Selector */}
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Button
              variant={rangeType === 'monthly' ? 'contained' : 'outlined'}
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => setRangeType('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={rangeType === 'weekly' ? 'contained' : 'outlined'}
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => setRangeType('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={rangeType === 'yearly' ? 'contained' : 'outlined'}
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => setRangeType('yearly')}
            >
              Yearly
            </Button>
            <Button
              variant={rangeType === 'custom' ? 'contained' : 'outlined'}
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600 }}
              onClick={() => setRangeType('custom')}
            >
              Custom
            </Button>
            {rangeType === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={customStart}
                  onChange={(date) => setCustomStart(date)}
                  renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 120 }} variant="filled" />}
                />
                <DatePicker
                  label="End Date"
                  value={customEnd}
                  onChange={(date) => setCustomEnd(date)}
                  renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 120 }} variant="filled" />}
                />
              </LocalizationProvider>
            )}
            <Typography variant="body2" ml={2}>
              Showing: {format(dateRange.start, 'yyyy-MM-dd')} to {format(dateRange.end, 'yyyy-MM-dd')}
            </Typography>
          </Stack>
          <Typography variant="subtitle1" mt={2} mb={1} fontWeight={600}>Employee Check-in History</Typography>
          <TableContainer sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f0f3fa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Check-in</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Check-out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No check-in data.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.flatMap((emp, idx) => {
                    const status = getEmployeeStatus(emp.employeeId);
                    return filterCheckinHistory(status.checkinHistory).map((rec, i) => (
                      <TableRow
                        key={emp.employeeId + '-' + i}
                        sx={{
                          bgcolor: i % 2 === 0 ? '#f7f9fc' : '#fff',
                          '&:hover': { bgcolor: '#e3e9f7' },
                          transition: 'background 0.2s',
                        }}
                      >
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{rec.date}</TableCell>
                        <TableCell>{rec.checkin}</TableCell>
                        <TableCell>{rec.checkout}</TableCell>
                      </TableRow>
                    ));
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="subtitle1" mt={2} mb={1} fontWeight={600}>Employee Leave Balance</Typography>
          <TableContainer sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f0f3fa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Leave Balance (days)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No leave data.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp, idx) => {
                    const status = getEmployeeStatus(emp.employeeId);
                    return (
                      <TableRow
                        key={emp.employeeId}
                        sx={{
                          bgcolor: idx % 2 === 0 ? '#f7f9fc' : '#fff',
                          '&:hover': { bgcolor: '#e3e9f7' },
                          transition: 'background 0.2s',
                        }}
                      >
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.employeeId}</TableCell>
                        <TableCell>{status.leaveBalance}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default Employee; 