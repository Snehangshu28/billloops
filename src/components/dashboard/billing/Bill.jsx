import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
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
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PrintIcon from '@mui/icons-material/Print';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const initialService = { description: '', rate: '', quantity: '' };

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    preview: (
      <Box sx={{ p: 2, border: '1px solid #1976d2', borderRadius: 2, background: '#f5f6fa', minWidth: 200 }}>
        <Typography variant="h6" color="primary">Modern</Typography>
        <Typography variant="body2">Blue header, clean lines, bold totals.</Typography>
      </Box>
    ),
  },
  {
    id: 'classic',
    name: 'Classic',
    preview: (
      <Box sx={{ p: 2, border: '1px solid #888', borderRadius: 2, background: '#fff', minWidth: 200 }}>
        <Typography variant="h6" color="text.secondary">Classic</Typography>
        <Typography variant="body2">Simple, black & white, traditional layout.</Typography>
      </Box>
    ),
  },
  // Add more templates as needed
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

const Bill = () => {
  const { data, updateBill } = useBusiness();
  const [bill, setBill] = useState(data.bill);
  const printRef = useRef();
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    // Try to load from localStorage or default to 'modern'
    return localStorage.getItem('billTemplate') || 'modern';
  });

  // Use onboarding business info for invoice header
  const businessInfo = data.onboarding.businessInfo || {};
  const businessName = businessInfo.name || '';
  const businessAddress = businessInfo.address || '';
  const businessEmail = businessInfo.email || '';
  const businessPhone = businessInfo.phone || '';
  const employees = data.employees || [];

  // Add CGST and SGST state
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);

  // Add payment mode options
  const paymentModes = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
  ];

  useEffect(() => {
    setBill(data.bill);
  }, [data.bill]);

  // Save template selection to localStorage
  useEffect(() => {
    localStorage.setItem('billTemplate', selectedTemplate);
  }, [selectedTemplate]);

  // Handlers
  const handleClientChange = (e) => {
    setBill((prev) => {
      const updated = { ...prev, client: { ...prev.client, [e.target.name]: e.target.value } };
      updateBill(updated);
      return updated;
    });
  };
  const handleServiceChange = (idx, field, value) => {
    setBill((prev) => {
      const updatedServices = prev.services.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      );
      const updated = { ...prev, services: updatedServices };
      updateBill(updated);
      return updated;
    });
  };
  const handleAddService = () => {
    setBill((prev) => {
      const updated = { ...prev, services: [...prev.services, { ...initialService }] };
      updateBill(updated);
      return updated;
    });
  };
  const handleRemoveService = (idx) => {
    setBill((prev) => {
      const updated = { ...prev, services: prev.services.filter((_, i) => i !== idx) };
      updateBill(updated);
      return updated;
    });
  };
  const handleDiscountChange = (e) => {
    setBill((prev) => {
      const updated = { ...prev, discount: e.target.value };
      updateBill(updated);
      return updated;
    });
  };
  const handleFooterChange = (e) => {
    setBill((prev) => {
      const updated = { ...prev, footer: e.target.value };
      updateBill(updated);
      return updated;
    });
  };
  const handleBankChange = (e) => {
    setBill((prev) => {
      const updated = { ...prev, business: { ...prev.business, [e.target.name]: e.target.value } };
      updateBill(updated);
      return updated;
    });
  };

  // Calculate subtotal for a row
  const calcSubtotal = (row) => {
    const rate = parseFloat(row.rate) || 0;
    const qty = parseFloat(row.quantity) || 0;
    return rate * qty;
  };
  // Calculate total and discount
  const subtotal = (bill.services || []).reduce((sum, row) => sum + calcSubtotal(row), 0);
  const discountPercent = parseFloat(bill.discount) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const cgstAmount = subtotal * (parseFloat(cgst) || 0) / 100;
  const sgstAmount = subtotal * (parseFloat(sgst) || 0) / 100;
  const total = subtotal - discountAmount + cgstAmount + sgstAmount;

  // Print handler with template selection
  const handlePrint = () => {
    const employeeName = '';
    let invoiceHtml = '';
    let style = '';
    if (selectedTemplate === 'modern') {
      invoiceHtml = `
        <div class=\"invoice-header\">
          <div class=\"app-title\">BILLUS</div>
          <div class=\"invoice-title\">INVOICE</div>
          <div class=\"business-details\">
            <span><b>${businessName}</b></span>
            <span>${businessAddress}</span>
            <span>Email: ${businessEmail}</span>
            <span>Phone: ${businessPhone}</span>
          </div>
        </div>
        <div class=\"client-details\">
          <span class=\"section-title\">Bill To</span>
          <span><b>${bill.client.name || 'Client Name'}</b></span>
          <span>${bill.client.address}</span>
          <span>Contact: ${bill.client.contact || ''}</span>
          <span>Invoice #: ${bill.client.invoice}</span>
          <span>Date: ${bill.client.date}</span>
          <span>Payment Mode: ${bill.client.paymentMode || ''}</span>
        </div>
        <div class=\"section-title\">Services</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Staff</th>
              <th>Rate (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${bill.services
              .map(
                (row) => `
              <tr>
                <td>${row.description}</td>
                <td>${row.staff || ''}</td>
                <td>${row.rate}</td>
                <td>${row.quantity}</td>
                <td>${calcSubtotal(row)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class=\"section-title\">Total: ₹${total}</div>
        <div class=\"footer\">${bill.footer || ''}</div>
      `;
      style = `
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; }
          .invoice-header { text-align: center; margin-bottom: 24px; }
          .app-title { font-size: 2rem; font-weight: 700; color: #437057; }
          .invoice-title { font-size: 1.5rem; font-weight: 600; margin-top: 8px; }
          .business-details span { display: block; font-size: 1rem; color: #2F5249; }
          .client-details { margin-bottom: 16px; }
          .section-title { font-weight: 600; margin-top: 16px; color: #437057; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #F8F9F6; }
          .footer { margin-top: 24px; font-size: 1rem; color: #888; }
        </style>
      `;
    } else {
      // Classic template
      invoiceHtml = `
        <div class=\"invoice-header\">
          <div class=\"app-title\">BILLUS</div>
          <div class=\"invoice-title\">INVOICE</div>
        </div>
        <div class=\"client-details\">Bill To: <b>${bill.client.name || 'Client Name'}</b></div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Staff</th>
              <th>Rate (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${bill.services
              .map(
                (row) => `
              <tr>
                <td>${row.description}</td>
                <td>${row.staff || ''}</td>
                <td>${row.rate}</td>
                <td>${row.quantity}</td>
                <td>${calcSubtotal(row)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div>Total: ₹${total}</div>
        <div>${bill.footer || ''}</div>
      `;
      style = `
        <style>
          body { font-family: Arial, sans-serif; }
          .invoice-header { text-align: center; margin-bottom: 24px; }
          .app-title { font-size: 2rem; font-weight: 700; color: #222; }
          .invoice-title { font-size: 1.5rem; font-weight: 600; margin-top: 8px; }
          .client-details { margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f5f5f5; }
        </style>
      `;
    }
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Invoice</title>${style}</head><body>${invoiceHtml}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 3 }}>
      <Stack direction="row" justifyContent="flex-end" mb={2} spacing={2}>
        <Button variant="outlined" onClick={() => setTemplateModalOpen(true)}>
          Choose Template
        </Button>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print Invoice
        </Button>
      </Stack>
      {/* Template Selection Modal */}
      <Dialog open={templateModalOpen} onClose={() => setTemplateModalOpen(false)} maxWidth="md">
        <DialogTitle>Choose Invoice Template</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            {TEMPLATES.map((tpl) => (
              <Box key={tpl.id} sx={{ border: tpl.id === selectedTemplate ? '2px solid #1976d2' : '1px solid #ccc', borderRadius: 2, p: 1, background: tpl.id === selectedTemplate ? '#e3f2fd' : '#fff', cursor: 'pointer' }}
                onClick={() => setSelectedTemplate(tpl.id)}>
                {tpl.preview}
                <Typography align="center" sx={{ mt: 1, fontWeight: tpl.id === selectedTemplate ? 700 : 400 }}>
                  {tpl.id === selectedTemplate ? 'Selected' : 'Select'}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Editable Form Only (no invoice preview) */}
      <Paper sx={{ p: { xs: 2, md: 4 }, mt: 3 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              label="Business Name"
              name="name"
              value={businessName}
              fullWidth
              variant="standard"
              InputProps={{ sx: { fontWeight: 700, fontSize: 24 }, readOnly: true }}
            />
            <TextField
              label="Business Address"
              name="address"
              value={businessAddress}
              fullWidth
              variant="standard"
              sx={{ mt: 1 }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Business Email"
              name="email"
              value={businessEmail}
              fullWidth
              variant="standard"
              sx={{ mt: 1 }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Business Phone"
              name="phone"
              value={businessPhone}
              fullWidth
              variant="standard"
              sx={{ mt: 1 }}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Client Name"
              name="name"
              value={bill.client.name}
              onChange={handleClientChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={bill.client.date}
              onChange={handleClientChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Invoice #"
              name="invoice"
              value={bill.client.invoice}
              onChange={handleClientChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Client Address"
              name="address"
              value={bill.client.address}
              onChange={handleClientChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Customer Contact Number"
              name="contact"
              value={bill.client.contact || ''}
              onChange={handleClientChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Services
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Rate (₹)</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Subtotal (₹)</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(bill.services || []).map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField
                      value={row.description}
                      onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                      placeholder="Description"
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth variant="standard">
                      <Select
                        value={row.staff || ''}
                        onChange={e => handleServiceChange(idx, 'staff', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {employees.map((emp, i) => (
                          <MenuItem value={emp.name} key={i}>{emp.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.rate}
                      onChange={(e) => handleServiceChange(idx, 'rate', e.target.value)}
                      placeholder="Rate"
                      variant="standard"
                      type="number"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.quantity}
                      onChange={(e) => handleServiceChange(idx, 'quantity', e.target.value)}
                      placeholder="Qty"
                      variant="standard"
                      type="number"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={calcSubtotal(row)}
                      variant="standard"
                      type="number"
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveService(idx)}
                      disabled={bill.services.length === 1}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    {idx === bill.services.length - 1 && (
                      <IconButton color="primary" onClick={handleAddService}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Discount (%)"
              value={bill.discount}
              onChange={handleDiscountChange}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              helperText={`Discount: ₹${discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="CGST (%)"
              value={cgst}
              onChange={e => setCgst(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              helperText={`CGST: ₹${cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="SGST (%)"
              value={sgst}
              onChange={e => setSgst(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              helperText={`SGST: ₹${sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Bank Name"
              name="bank"
              value={bill.business.bank}
              onChange={handleBankChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Account Number"
              name="account"
              value={bill.business.account}
              onChange={handleBankChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
              <Select
                labelId="payment-mode-label"
                name="paymentMode"
                value={bill.client.paymentMode || ''}
                label="Payment Mode"
                onChange={handleClientChange}
              >
                {paymentModes.map((mode) => (
                  <MenuItem value={mode.value} key={mode.value}>{mode.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Total (INR):
              </Typography>
              <Typography variant="h5" color="primary" sx={{ minWidth: 120, textAlign: 'right' }}>
                ₹ {total >= 0 ? total.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <TextField
          label="Footer Note"
          value={bill.footer}
          onChange={handleFooterChange}
          fullWidth
          multiline
          minRows={2}
        />
      </Paper>
    </Box>
  );
};

export default Bill; 