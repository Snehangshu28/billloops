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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useBusiness } from '../../context/BusinessContext';

const initialProduct = { name: '', quantity: '' };

const Stock = () => {
  const { data, updateStock } = useBusiness();
  const [products, setProducts] = useState(data.stock);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState(initialProduct);

  useEffect(() => {
    setProducts(data.stock);
  }, [data.stock]);

  const handleOpen = (idx = null) => {
    setEditIdx(idx);
    setForm(idx !== null ? products[idx] : initialProduct);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm(initialProduct);
    setEditIdx(null);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    let updated;
    if (editIdx !== null) {
      updated = products.map((p, i) => (i === editIdx ? form : p));
    } else {
      updated = [...products, form];
    }
    setProducts(updated);
    updateStock(updated);
    handleClose();
  };
  const handleDelete = (idx) => {
    const updated = products.filter((_, i) => i !== idx);
    setProducts(updated);
    updateStock(updated);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 3, bgcolor: '#f7f9fc', p: { xs: 1, md: 3 }, borderRadius: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 5 }, boxShadow: 3, borderRadius: 4 }} elevation={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>Products</Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large" sx={{ borderRadius: 2, fontWeight: 600 }} onClick={() => handleOpen()}>
            Add Product
          </Button>
        </Stack>
        <TableContainer sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f0f3fa' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Quantity</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No products added yet.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#f7f9fc' : '#fff',
                      '&:hover': { bgcolor: '#e3e9f7' },
                      transition: 'background 0.2s',
                    }}
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, boxShadow: 6 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>{editIdx !== null ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                variant="filled"
                required
              />
              <TextField
                label="Quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                fullWidth
                variant="filled"
                required
                type="number"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" size="large" sx={{ borderRadius: 2, fontWeight: 600 }} disabled={!form.name || !form.quantity}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Stock; 