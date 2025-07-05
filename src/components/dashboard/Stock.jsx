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
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 3, bgcolor: COLORS.background, p: { xs: 1, md: 3 }, borderRadius: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 5 }, boxShadow: 3, borderRadius: 4 }} elevation={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700} sx={FONT}>Products</Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large" sx={{ borderRadius: 2, fontWeight: 600 }} onClick={() => handleOpen()}>
            Add Product
          </Button>
        </Stack>
        <TableContainer sx={{  boxShadow: 2 }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f0f3fa' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Price</TableCell>
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
                    <TableCell>{product.price}</TableCell>
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: {  boxShadow: 6 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>{editIdx !== null ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
  <Stack spacing={3} mt={1}>
    <Box>
      <Typography sx={{ fontWeight: 600, mb: 1, color: COLORS.text }}>Product Name</Typography>
      <TextField
        placeholder="Enter product name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#FAFAFA',
          },
        }}
        required
      />
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 600, mb: 1, color: COLORS.text }}>Quantity</Typography>
      <TextField
        placeholder="Enter quantity"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        type="number"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#FAFAFA',
          },
        }}
        required
      />
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 600, mb: 1, color: COLORS.text }}>Price</Typography>
      <TextField
        placeholder="Enter Price"
        name="price"
        value={form.price}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        type="number"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#FAFAFA',
          },
        }}
        required
      />
    </Box>
  </Stack>
</DialogContent>

<DialogActions sx={{ px: 3, pb: 3 }}>
  <Button
    onClick={handleClose}
    variant="outlined"
    size="large"
    sx={{
      
      fontWeight: 600,
      textTransform: 'none',
      color: COLORS.primaryDark,
      borderColor: COLORS.primary,
      '&:hover': { backgroundColor: '#f2f4f7' },
    }}
  >
    Cancel
  </Button>
  <Button
    onClick={handleSave}
    variant="contained"
    size="large"
    disabled={!form.name || !form.price}
    sx={{
      
      fontWeight: 600,
      textTransform: 'none',
      backgroundColor: COLORS.primary,
      '&:hover': { backgroundColor: COLORS.primaryDark },
    }}
  >
    {editIdx !== null ? 'Update' : 'Save'}
  </Button>
</DialogActions>

        </Dialog>
      </Paper>
    </Box>
  );
};

export default Stock; 