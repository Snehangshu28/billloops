import React, { createContext, useContext, useEffect, useState } from 'react';

const LOCAL_KEY = 'business-app-data-v1';

const defaultData = {
  onboarding: {
    category: '',
    subcategories: [],
    businessInfo: { name: '', address: '', phone: '', email: '' },
  },
  profile: {
    name: 'Business Name',
    email: 'business@email.com',
    phone: '9876543210',
    address: '123 Main St, City, State',
    plan: 'Free Trial',
  },
  bill: {
    business: { name: 'Business Name', address: '123 Main St, City, State', bank: 'Bank of India', account: '1234567890' },
    client: { name: '', address: '', date: '', invoice: '' },
    services: [{ description: '', rate: '', quantity: '', subtotal: '' }],
    discount: '',
    footer: 'Thank you for your business!',
  },
  stock: [],
  employees: [],
};

const BusinessContext = createContext();

export const useBusiness = () => useContext(BusinessContext);

export const BusinessProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }, [data]);

  // Updaters for each section
  const updateOnboarding = (onboarding) => setData((d) => ({ ...d, onboarding }));
  const updateProfile = (profile) => setData((d) => ({ ...d, profile }));
  const updateBill = (bill) => setData((d) => ({ ...d, bill }));
  const updateStock = (stock) => setData((d) => ({ ...d, stock }));
  const updateEmployees = (employees) => setData((d) => ({ ...d, employees }));

  return (
    <BusinessContext.Provider
      value={{
        data,
        updateOnboarding,
        updateProfile,
        updateBill,
        updateStock,
        updateEmployees,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}; 