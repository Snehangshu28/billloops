import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  console.log('PrivateRoute', 'currentUser', userId);
  return userId ? <Outlet /> : <Navigate to="/login" />;
}
