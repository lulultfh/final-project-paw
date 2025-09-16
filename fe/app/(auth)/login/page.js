"use client";

import { useAuth } from "@/app/context/authContext";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState(''); // DIUBAH: dari email menjadi username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Username dan password wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://10.69.2.146:3001/api/user/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, passwd: password }), 
      });

      const data = await res.json();
      console.log('Data dari server:', data); 

      if (!res.ok) {
        // Jika respons tidak OK, langsung lempar error
        throw new Error(data.message || 'Gagal login. Periksa kembali username dan password Anda.');
      }

      if (data.token && data.user) {
        login(data.token, data.user);
        if (data.user.role === 'admin') {
          router.push('/home-admin');
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Login berhasil tetapi tidak ada token yang diterima.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-transparent rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">Sign in to continue to Butter&Bliss</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* Label dan input diubah menjadi untuk username */}
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#F3EBD8] border border-transparent rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#F76079] sm:text-sm"
              placeholder="Enter your username"
              required
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
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#7D5A5A] bg-[#F3EBD8] hover:bg-[#F76079] hover:text-[#F3EBD8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-[#F76079] hover:text-[#7D5A5A]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}