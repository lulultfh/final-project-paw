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
  const [userData, setUserData] = useState(null);

  // Gunakan useEffect untuk memeriksa status login dari localStorage saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userJSON = localStorage.getItem('user');
    if (token && userJSON) {
      try {
        const user = JSON.parse(userJSON);
        setIsLoggedIn(true);
        setUserToken(token);
        setUserData(user); // ← isi state userData
      } catch (e) {
        console.error("Gagal parsing user data:", e);
        logout(); // opsional: logout jika data corrupt
      }
    }
    setIsLoading(false);
  }, []);

    const login = (token, user) => {
    localStorage.setItem('authToken', token); // Simpan token ke local storage
    localStorage.setItem('user', JSON.stringify(user));
    setUserToken(token);                     // Simpan token ke state
    setUserData(user);
    setIsLoggedIn(true);                     // Update status login
  };

  const logout = () => {
    localStorage.removeItem('authToken');   // Hapus token dari local storage
    localStorage.removeItem('user');
    setUserToken(null);                      // Hapus token dari state
    setUserData(null);
    setIsLoggedIn(false);      
    router.push('/');              // Update status login
  };

   const value = {
    isLoggedIn,
    userToken, // Opsional, tapi sangat berguna untuk dimiliki
    userData, // Data user lengkap
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