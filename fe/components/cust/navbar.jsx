"use client";

import React from "react";
import SearchBar from "./search";
import CartCount from "./ui/cart-count";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";

export default function NavbarCustMenu() {
  const { isLoggedIn, userData } = useAuth(); // Ambil userData dari context

  // Tentukan gambar profil, gunakan placeholder jika tidak ada
  const profileImageUrl = userData?.image
  ? `http://192.168.1.4:3001/uploads/avatar_user/${userData.image}`
  : '/user-avatar-1.png'; // Atau gambar default lain
  
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-6 ml-6">
            {isLoggedIn ? (
              <>
                <Link href="/cart">
                  <CartCount />
                </Link>
                <div className="h-6 w-px bg-[#72541B]"></div>
                {/* Tambahkan Link di sini
                  dan gunakan userData untuk gambar profil
                */}
                <Link href="/profile">
                  <img
                    src={profileImageUrl} // Gunakan variabel ini
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    // Tambahkan juga onError sebagai fallback
                    onError={(e) => { e.target.onerror = null; e.target.src='/path/to/default/avatar.png'; }}
                  />
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[#72541B] rounded-md border border-[#72541B] hover:bg-[#72541B] hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#72541B] rounded-md border border-transparent hover:bg-transparent hover:text-[#72541B] hover:border-[#72541B]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}