"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/authContext";

export default function ProfilePage() {
  const { userData, isLoading, isLoggedIn } = useAuth();

  // Tidak perlu lagi ada useEffect untuk mengambil data.
  // data sudah disediakan oleh context.

  // Tampilkan loading saat AuthContext masih memuat
  if (isLoading) {
    return <div className="text-center mt-20">Memuat profil...</div>;
  }

  // Tampilkan pesan jika belum login atau data user tidak ada
  if (!isLoggedIn || !userData) {
    return <div className="text-center mt-20 text-red-500">Silakan login untuk melihat profil Anda.</div>;
  }

  // Tentukan URL avatar
  const avatarUrl = userData.image 
  ? `http://192.168.1.4:3001/uploads/avatar_user/${userData.image}` 
  : `/user-avatar-1.png`;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#F3EBD8] rounded-lg shadow-md my-10">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={avatarUrl}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full object-cover border-4 border-[#F5EBE0]"
        />
        <div>
          <h1 className="text-3xl text-center sm:text-left font-bold text-[#6F4E37]">{userData.nama}</h1>
          <p className="text-gray-500 text-center sm:text-left">{userData.email}</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-[#6F4E37]">Informasi Akun</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
            <p className="mt-1 text-lg">{userData.nama}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <p className="mt-1 text-lg">{userData.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-lg">{userData.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link href="/profile/edit">
          <button className="px-6 py-2 text-white bg-[#72541B] rounded-md hover:bg-opacity-90 transition-colors">
            Edit Profil
          </button>
        </Link>
      </div>
    </div>
  );
}