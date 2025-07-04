import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedTenant = JSON.parse(localStorage.getItem('tenant'));
    if (storedUser) setCurrentUser(storedUser);
    if (storedTenant) setTenantData(storedTenant);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        const tenantDoc = await getDoc(doc(db, 'tenants', user.uid));
        if (tenantDoc.exists()) {
          setTenantData(tenantDoc.data());
          localStorage.setItem('tenant', JSON.stringify(tenantDoc.data()));
        }
      } else {
        setCurrentUser(null);
        setTenantData(null);
        localStorage.removeItem('user');
        localStorage.removeItem('tenant');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signup({ company, email, phone, password, country }) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const tenantData = {
      company,
      email,
      phone,
      country,
      createdAt: new Date(),
      ownerUid: user.uid,
    };
    await setDoc(doc(db, 'tenants', user.uid), tenantData);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tenant', JSON.stringify(tenantData));
    setCurrentUser(user);
    setTenantData(tenantData);
    return user;
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const tenantDoc = await getDoc(doc(db, 'tenants', user.uid));
    if (tenantDoc.exists()) {
      const tenantData = tenantDoc.data();
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tenant', JSON.stringify(tenantData));
      setCurrentUser(user);
      setTenantData(tenantData);
    }
    return user;
  }

  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
    setTenantData(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
  }
  console.log('AuthProvider', 'currentUser', currentUser);
  const value = {
    currentUser,
    tenantData,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
