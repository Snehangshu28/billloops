import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    phone: ""
  });

  const db = getFirestore();
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in");
      return;
    }

    const tenantId = user.uid;

    try {
      await addDoc(collection(db, "tenants", tenantId, "employees"), {
        ...formData,
        createdAt: new Date()
      });

      alert("Employee saved successfully!");
      setFormData({ name: "", email: "", position: "", phone: "" });
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Position"
        name="position"
        value={formData.position}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Save Employee
      </Button>
    </Box>
  );
};

export default EmployeeForm; 