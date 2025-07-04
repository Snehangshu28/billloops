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
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileModal = ({ open, onClose }) => {
  const { currentUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    company: '',
    country: '',
    email: '',
    phone: '',
    ownerUid: '',
    createdAt: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, 'tenants', currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            company: data.company || '',
            country: data.country || '',
            email: data.email || '',
            phone: data.phone || '',
            ownerUid: data.ownerUid || '',
            createdAt: data.createdAt || '',
          });
        }
      }
      setLoading(false);
    };
    if (open) {
      setLoading(true);
      fetchProfile();
    }
  }, [currentUser, open]);

  const handleEdit = () => setEdit(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (currentUser?.uid) {
      await setDoc(
        doc(db, 'tenants', currentUser.uid),
        {
          company: form.company,
          country: form.country,
          email: form.email,
          phone: form.phone,
          ownerUid: form.ownerUid,
          // Do not overwrite createdAt if it already exists
          ...(form.createdAt ? { createdAt: form.createdAt } : {}),
        },
        { merge: true }
      );
    }
    setEdit(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              fullWidth
              InputProps={{ readOnly: !edit }}
            />
            <TextField
              label="Country"
              name="country"
              value={form.country}
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
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {edit ? (
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={
              !form.company ||
              !form.country ||
              !form.email ||
              !form.phone ||
              !form.ownerUid
            }
          >
            Save
          </Button>
        ) : (
          <Button onClick={handleEdit} startIcon={<EditIcon />}>
            Edit
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
