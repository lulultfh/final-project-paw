"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Buat konteks otentikasi
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Gunakan state untuk melacak status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Gunakan useEffect untuk memeriksa status login dari localStorage saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Di sini Anda bisa memverifikasi token jika diperlukan
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const value = { isLoggedIn, setIsLoggedIn };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk mengakses konteks
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}