import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ProductCategory = () => {
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return;
    await addDoc(collection(db, 'categories'), { name: category.trim() });
    setCategory('');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Product Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Category
        </Button>
      </form>
    </Box>
  );
};

export default ProductCategory; 