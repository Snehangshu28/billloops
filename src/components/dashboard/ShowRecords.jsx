import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ShowRecords = () => {
  const { currentUser } = useAuth();
  const tenantId = currentUser?.uid;
  const [records, setRecords] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!tenantId) return;
    const unsub = onSnapshot(collection(db, 'tenants', tenantId, 'bills'), (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [tenantId]);

  const handleDelete = async (id) => {
    if (!tenantId) return;
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    await deleteDoc(doc(db, 'tenants', tenantId, 'bills', id));
  };

  const handleView = (bill) => {
    alert(`Invoice #: ${bill.client?.invoice || 'N/A'}\nClient: ${bill.client?.name || 'N/A'}\nDate: ${bill.client?.date || 'N/A'}\nTotal: ₹${bill.total || 0}`);
  };

  const handleEdit = (bill) => {
    navigate(`/bill/edit/${bill.id}`, {
      state: {
        billData: bill,
        isEditing: true,
      },
    });
  };

  // Filter records based on all three fields
  const filteredRecords = records.filter((rec) => {
    const nameMatch = rec.client?.name?.toLowerCase().includes(searchName.toLowerCase());
    const invoiceMatch = rec.client?.invoice?.toLowerCase().includes(searchInvoice.toLowerCase());
    const dateMatch = rec.client?.date?.toLowerCase().includes(searchDate.toLowerCase());
    return nameMatch && invoiceMatch && dateMatch;
  });

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Show Records
      </Typography>

      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Client Name"
              variant="outlined"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Invoice #"
              variant="outlined"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Date"
              variant="outlined"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total (INR)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No records found.</TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((rec) => {
                let total = rec.total;
                let subtotal = rec.subtotal;
                let discountAmount = rec.discountAmount;
                let cgstAmount = rec.cgstAmount;
                let sgstAmount = rec.sgstAmount;

                if (typeof total === 'undefined') {
                  subtotal = (rec.services || []).reduce((sum, row) => {
                    const rate = parseFloat(row.rate) || 0;
                    const qty = parseFloat(row.quantity) || 0;
                    return sum + rate * qty;
                  }, 0);
                  const discountPercent = parseFloat(rec.discount) || 0;
                  discountAmount = subtotal * (discountPercent / 100);
                  cgstAmount = subtotal * (parseFloat(rec.cgst) || 0) / 100;
                  sgstAmount = subtotal * (parseFloat(rec.sgst) || 0) / 100;
                  total = subtotal - discountAmount + cgstAmount + sgstAmount;
                }

                return (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.client?.invoice || ''}</TableCell>
                    <TableCell>{rec.client?.name || ''}</TableCell>
                    <TableCell>{rec.client?.date || ''}</TableCell>
                    <TableCell>
                      ₹ {total >= 0 ? total.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleView(rec)}><VisibilityIcon /></IconButton>
                      <IconButton color="secondary" onClick={() => handleEdit(rec)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(rec.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShowRecords;
