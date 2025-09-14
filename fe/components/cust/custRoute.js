"use client";

import { useAuth } from '@/app/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserRoute({ children }) {
  const { isLoggedIn, userData, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Tunggu verifikasi selesai

    // Jika sudah login dan ternyata adalah admin, redirect
    if (isLoggedIn && userData?.role === 'admin') {
      router.push('/home-admin');
    }
  }, [isLoading, isLoggedIn, userData, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Tampilkan loading
  }

  // Jika BUKAN admin, atau BELUM login, tampilkan halamannya
  if (userData?.role !== 'admin') {
    return <>{children}</>;
  }

  return null; // Tampilkan null selagi redirect
}