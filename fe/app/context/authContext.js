"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Buat konteks otentikasi
import { useRouter } from 'next/navigation';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Gunakan state untuk melacak status login
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gunakan useEffect untuk memeriksa status login dari localStorage saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Di sini Anda bisa memverifikasi token jika diperlukan
      setIsLoggedIn(true);
      setUserToken(token);
    }
    setIsLoading(false);
  }, []);

    const login = (token) => {
    localStorage.setItem('authToken', token); // Simpan token ke local storage
    setUserToken(token);                     // Simpan token ke state
    setIsLoggedIn(true);                     // Update status login
  };

  const logout = () => {
    localStorage.removeItem('authToken');   // Hapus token dari local storage
    setUserToken(null);                      // Hapus token dari state
    setIsLoggedIn(false);      
    router.push('/');              // Update status login
  };

   const value = {
    isLoggedIn,
    userToken, // Opsional, tapi sangat berguna untuk dimiliki
    login,
    logout,
  };

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