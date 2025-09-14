"use client";

import { useAuth } from '@/app/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Komponen HOC (Higher-Order Component) untuk melindungi rute yang
 * hanya boleh diakses oleh pengguna dengan role 'admin'.
 * * Cara kerja:
 * 1. Mengambil status otentikasi (isLoading, isLoggedIn, userData) dari AuthContext.
 * 2. Menampilkan loading indicator jika konteks sedang memverifikasi login.
 * 3. Jika verifikasi selesai:
 * - Redirect ke '/login' jika pengguna belum login.
 * - Redirect ke '/' jika pengguna sudah login tapi bukan admin.
 * - Menampilkan konten halaman (children) jika pengguna adalah admin.
 */
export default function AdminRoute({ children }) {
  // Ambil semua state yang relevan dari context Anda
  // Asumsi 'isLoading' juga diekspor dari useAuth() untuk menangani pemuatan awal
  const { userData, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jangan lakukan apa-apa jika AuthContext masih memuat data dari localStorage.
    // Ini mencegah redirect yang salah saat pertama kali render.
    if (isLoading) {
      return; 
    }

    // Jika sudah tidak loading dan ternyata belum login, tendang ke halaman login.
    if (!isLoggedIn) {
      router.push('/login');
    }
    // Jika sudah login, tapi rolenya bukan admin, tendang ke halaman utama.
    else if (userData?.role !== 'admin') {
      router.push('/');
    }
  }, [isLoading, isLoggedIn, userData, router]);

  // Selama loading, tampilkan UI loading untuk UX yang lebih baik
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Jika semua kondisi terpenuhi (login dan admin), tampilkan halaman yang dilindungi.
  if (isLoggedIn && userData?.role === 'admin') {
    return <>{children}</>;
  }

  // Tampilkan null atau loading component selagi redirect berjalan
  return null;
}
