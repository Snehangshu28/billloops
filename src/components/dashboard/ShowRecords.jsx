import React, { useEffect, useState } from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const ShowRecords = () => {
  const { currentUser } = useAuth();
  const tenantId = currentUser?.uid;
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [selectedBill, setSelectedBill] = useState(null);
  const [editBill, setEditBill] = useState(null);

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
    setSelectedBill(bill);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (bill) => {
    setEditBill({ ...bill });
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBill((prev) => ({ ...prev, client: { ...prev.client, [name]: value } }));
  };

  const handleEditSave = async () => {
    if (!tenantId || !editBill) return;
    await updateDoc(doc(db, 'tenants', tenantId, 'bills', editBill.id), editBill);
    setModalOpen(false);
    setEditBill(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBill(null);
    setEditBill(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>Show Records</Typography>
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
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No records found.</TableCell>
              </TableRow>
            ) : (
              records.map((rec) => {
                // Calculate total for each record
                const subtotal = (rec.services || []).reduce((sum, row) => {
                  const rate = parseFloat(row.rate) || 0;
                  const qty = parseFloat(row.quantity) || 0;
                  return sum + rate * qty;
                }, 0);
                const discountPercent = parseFloat(rec.discount) || 0;
                const discountAmount = subtotal * (discountPercent / 100);
                const cgstAmount = subtotal * (parseFloat(rec.cgst) || 0) / 100;
                const sgstAmount = subtotal * (parseFloat(rec.sgst) || 0) / 100;
                const total = subtotal - discountAmount + cgstAmount + sgstAmount;
                return (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.client?.invoice || ''}</TableCell>
                    <TableCell>{rec.client?.name || ''}</TableCell>
                    <TableCell>{rec.client?.date || ''}</TableCell>
                    <TableCell>₹ {total >= 0 ? total.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}</TableCell>
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
      {/* Modal for View/Edit */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>{modalMode === 'view' ? 'View Bill' : 'Edit Bill'}</DialogTitle>
        <DialogContent>
          {modalMode === 'view' && selectedBill && (
            <Stack spacing={2} mt={1}>
              <TextField label="Invoice #" value={selectedBill.client?.invoice || ''} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Client Name" value={selectedBill.client?.name || ''} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Date" value={selectedBill.client?.date || ''} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Total (INR)" value={`₹ ${(selectedBill.services||[]).reduce((sum, row) => sum + ((parseFloat(row.rate)||0)*(parseFloat(row.quantity)||0)), 0) - ((parseFloat(selectedBill.discount)||0)/100)*((selectedBill.services||[]).reduce((sum, row) => sum + ((parseFloat(row.rate)||0)*(parseFloat(row.quantity)||0)), 0)) + ((parseFloat(selectedBill.cgst)||0)/100)*((selectedBill.services||[]).reduce((sum, row) => sum + ((parseFloat(row.rate)||0)*(parseFloat(row.quantity)||0)), 0)) + ((parseFloat(selectedBill.sgst)||0)/100)*((selectedBill.services||[]).reduce((sum, row) => sum + ((parseFloat(row.rate)||0)*(parseFloat(row.quantity)||0)), 0))}`}
                fullWidth InputProps={{ readOnly: true }} />
            </Stack>
          )}
          {modalMode === 'edit' && editBill && (
            <Stack spacing={2} mt={1}>
              <TextField label="Invoice #" name="invoice" value={editBill.client?.invoice || ''} onChange={handleEditChange} fullWidth />
              <TextField label="Client Name" name="name" value={editBill.client?.name || ''} onChange={handleEditChange} fullWidth />
              <TextField label="Date" name="date" value={editBill.client?.date || ''} onChange={handleEditChange} fullWidth />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Close</Button>
          {modalMode === 'edit' && <Button onClick={handleEditSave} variant="contained">Save</Button>}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShowRecords; 