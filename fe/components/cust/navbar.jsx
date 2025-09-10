// components/cust/ui/navbar.jsx
"use client";

import React, { useState } from "react";
import SearchBar from "./search";
import CartCount from "./ui/cart-count";
import ProductPage from "@/app/(shop)/product/page";
import Carousel from "./ui/carousel";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";

export default function NavbarCustMenu() {
  const { isLoggedIn } = useAuth(); // Ambil isLoggedIn dari context

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
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
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
