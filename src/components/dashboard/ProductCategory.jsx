import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { db } from "../../firebase";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const ProductCategory = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { currentUser } = useAuth();
  const tenantId = currentUser?.uid;

  useEffect(() => {
    if (!tenantId) return;

    const q = query(collection(db, "tenants", tenantId, "categories"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    });

    return () => unsubscribe();
  }, [tenantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim() || !tenantId) return;

    await addDoc(collection(db, "tenants", tenantId, "categories"), {
      name: category.trim(),
    });

    setCategory("");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
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

      {/* Category cards */}
      {categories.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Category List
          </Typography>
          <Grid container spacing={2}>
            {categories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.id}>
                <Card
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "#aaa",
                    },
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {cat.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductCategory;
