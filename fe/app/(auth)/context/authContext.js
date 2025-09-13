"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Fungsi login yang akan dipanggil dari halaman login
  const login = (newToken, userData) => {
    
    // --- TAMBAHKAN BAGIAN INI ---
    // Pastikan nama properti 'id_user' sesuai dengan respons dari API Anda.
    // Buka console log di browser untuk melihat struktur 'userData'.
    // Mungkin namanya 'id', '_id', atau 'userId'.
    localStorage.setItem('userId', userData.id_user); 
    localStorage.setItem('token', newToken);
    // ----------------------------

    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    // Hapus data dari localStorage saat logout
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook custom untuk mempermudah penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};