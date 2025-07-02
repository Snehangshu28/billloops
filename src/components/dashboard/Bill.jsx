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
import { useBusiness } from '../../context/BusinessContext';
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
            ${(bill.services || []).map(row => `
              <tr>
                <td>${row.description}</td>
                <td>${row.staff || ''}</td>
                <td>${row.rate}</td>
                <td>${row.quantity}</td>
                <td>${calcSubtotal(row)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class=\"summary\" style=\"text-align:right;\">
          <div><span class=\"label\">Subtotal:</span><span class=\"value\">₹ ${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
          <div><span class=\"label\">Discount (${discountPercent}%):</span><span class=\"value\">- ₹ ${discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
          <div><span class=\"label\">CGST (${cgst}%):</span><span class=\"value\">+ ₹ ${cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
          <div><span class=\"label\">SGST (${sgst}%):</span><span class=\"value\">+ ₹ ${sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
          <div style=\"margin-top:12px; font-size:1.3rem; font-weight:700; color:#1976d2; border-top:2px solid #1976d2; padding-top:8px;\"><span class=\"label\">Total:</span><span class=\"value\" style=\"margin-left:16px;\">₹ ${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
        </div>
        <div class=\"section-title\">Bank Details</div>
        <div style=\"margin-bottom: 8px;\">
          <span>Bank Name: ${bill.business.bank}</span><br />
          <span>Account Number: ${bill.business.account}</span>
        </div>
        <div class=\"footer-note\">${bill.footer}</div>
      `;
      style = `
        body { font-family: Roboto, Arial, sans-serif; background: #f5f6fa; margin: 0; }
        .invoice-container { max-width: 800px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 40px 32px; }
        .app-title { font-size: 2.4rem; font-weight: 900; color: #1976d2; letter-spacing: 2px; text-align: center; margin-bottom: 8px; }
        .invoice-header { border-bottom: 2px solid #1976d2; padding-bottom: 16px; margin-bottom: 32px; }
        .invoice-title { font-size: 2.2rem; font-weight: 700; color: #1976d2; letter-spacing: 1px; text-align: center; }
        .business-details, .client-details { margin-bottom: 16px; }
        .business-details span, .client-details span { display: block; font-size: 1rem; color: #333; }
        .section-title { font-size: 1.1rem; font-weight: 600; color: #1976d2; margin-bottom: 8px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e0e0e0; padding: 10px 8px; text-align: left; }
        th { background: #f5f6fa; color: #1976d2; font-weight: 600; }
        .total-row td { font-size: 1.1rem; font-weight: 700; color: #1976d2; border-top: 2px solid #1976d2; }
        .summary { margin-top: 24px; text-align: right; }
        .summary .label { font-weight: 500; color: #555; }
        .summary .value { font-size: 1.2rem; font-weight: 700; color: #1976d2; margin-left: 16px; }
        .footer-note { margin-top: 32px; font-size: 1rem; color: #666; border-top: 1px dashed #bdbdbd; padding-top: 16px; }
        @media print { body { background: #fff; } .invoice-container { box-shadow: none; margin: 0; } }
      `;
    } else if (selectedTemplate === 'classic') {
      invoiceHtml = `
        <div style=\"border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:24px;\">
          <h2 style=\"margin:0;\">INVOICE</h2>
          <div><b>${businessName}</b></div>
          <div>${businessAddress}</div>
          <div>Email: ${businessEmail}</div>
          <div>Phone: ${businessPhone}</div>
        </div>
        <div style=\"margin-bottom:16px;\">
          <b>Bill To:</b> ${bill.client.name || 'Client Name'}<br/>
          ${bill.client.address}<br/>
          Contact: ${bill.client.contact || ''}<br/>
          Invoice #: ${bill.client.invoice}<br/>
          Date: ${bill.client.date}<br/>
          Payment Mode: ${bill.client.paymentMode || ''}
        </div>
        <table style=\"width:100%;border-collapse:collapse;margin-bottom:16px;\">
          <thead>
            <tr>
              <th style=\"border:1px solid #000;padding:6px;\">Description</th>
              <th style=\"border:1px solid #000;padding:6px;\">Staff</th>
              <th style=\"border:1px solid #000;padding:6px;\">Rate (₹)</th>
              <th style=\"border:1px solid #000;padding:6px;\">Quantity</th>
              <th style=\"border:1px solid #000;padding:6px;\">Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${(bill.services || []).map(row => `
              <tr>
                <td style=\"border:1px solid #000;padding:6px;\">${row.description}</td>
                <td style=\"border:1px solid #000;padding:6px;\">${row.staff || ''}</td>
                <td style=\"border:1px solid #000;padding:6px;\">${row.rate}</td>
                <td style=\"border:1px solid #000;padding:6px;\">${row.quantity}</td>
                <td style=\"border:1px solid #000;padding:6px;\">${calcSubtotal(row)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style=\"text-align:right;\">
          <div>Subtotal: ₹ ${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div>Discount (${discountPercent}%): - ₹ ${discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div>CGST (${cgst}%): + ₹ ${cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div>SGST (${sgst}%): + ₹ ${sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div style=\"margin-top:12px; font-size:1.2rem; font-weight:700; color:#1976d2; border-top:2px solid #000; padding-top:8px;\"><b>Total: ₹ ${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</b></div>
        </div>
        <div style=\"margin-top:16px;\">
          <b>Bank Name:</b> ${bill.business.bank}<br/>
          <b>Account Number:</b> ${bill.business.account}
        </div>
        <div style=\"margin-top:24px;font-size:0.95rem;color:#444;\">${bill.footer}</div>
      `;
      style = `
        body { font-family: Arial, sans-serif; background: #fff; margin: 0; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 6px; }
        h2 { color: #000; }
      `;
    }
    const win = window.open('', '', 'height=900,width=900');
    win.document.write('<html><head><title>Invoice</title>');
    win.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" />');
    win.document.write(`<style>${style}</style>`);
    win.document.write('</head><body>');
    win.document.write(`<div class=\"invoice-container\">${invoiceHtml}</div>`);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
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