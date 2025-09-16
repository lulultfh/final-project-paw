"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi sederhana
    if (!nama || !username || !email || !password) {
      setError('Semua field wajib diisi.');
      return;
    }

    try {
<<<<<<< HEAD
      const res = await fetch('http://10.69.2.146:3001/api/user', { // Pastikan URL endpoint benar
=======
      const res = await fetch('http://localhost:3001/api/user', { // Pastikan URL endpoint benar
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          username,
          email,
          passwd: password,
          role: 'cust' // Atur role default ke 'user'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika ada pesan error dari server, tampilkan
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar.');
      }

      // Jika berhasil
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/login'); // Arahkan ke halaman login setelah 2 detik
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-transparent rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Butter&Bliss</h1>
          <p className="text-gray-500">Let's get started with your account</p>
        </div>

        {/* Menampilkan pesan error atau sukses */}
        {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
        {success && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#F3EBD8] border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#F76079] sm:text-sm"
              placeholder="Enter your name"
            />
          </div>
          <div> 
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#F3EBD8] border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#F76079] sm:text-sm"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#F3EBD8] border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#F76079] sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#F3EBD8] border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#F76079] sm:text-sm"
              placeholder="Create a password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#7D5A5A] bg-[#F3EBD8] hover:bg-[#F76079] hover:text-[#F3EBD8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create account
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#F76079] hover:text-[#7D5A5A]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}