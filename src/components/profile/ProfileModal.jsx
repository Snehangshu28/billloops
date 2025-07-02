import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useBusiness } from '../../context/BusinessContext';

const ProfileModal = ({ open, onClose }) => {
  const { data, updateProfile } = useBusiness();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(data.profile);

  useEffect(() => {
    setForm(data.profile);
  }, [data.profile, open]);

  const handleEdit = () => setEdit(true);
  const handleSave = () => {
    updateProfile({ ...form, plan: data.profile.plan });
    setEdit(false);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !edit }}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !edit }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !edit }}
          />
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !edit }}
            multiline
            minRows={2}
          />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Current Plan: <b>{data.profile.plan}</b>
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        {edit ? (
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!(form.name && form.email && form.phone && form.address)}
          >
            Save
          </Button>
        ) : (
          <Button onClick={handleEdit} startIcon={<EditIcon />}>Edit</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal; 