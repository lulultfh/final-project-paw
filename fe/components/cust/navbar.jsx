"use client";

import React, { useState } from "react";
import SearchBar from "./search";
import CartCount from "./ui/cart-count";
import ProductPage from "@/app/(shop)/product/page";
import Carousel from "./ui/carousel"; // Import Carousel di sini

export default function NavbarCustMenu() {
  const [activeTab, setActiveTab] = useState("ForYou");

  const navItems = [
    { name: "ForYou", id: "foryou" },
    { name: "Product", id: "product" },
  ];

  return (
    <div className="w-full border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-6 ml-6">
            <CartCount />
            <div className="h-6 w-px bg-[#72541B]"></div>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="flex justify-center space-x-8 mt-4 text-sm font-medium text-gray-800">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.name)}
              className={`relative pb-1 transition-colors duration-200 border-b-2 ${
                activeTab === item.name
                  ? "border-pink-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "ForYou" && (
            <div className="flex flex-col justify-start items-center">
              <Carousel /> {/* Tampilkan Carousel di sini */}
              <ProductPage limit={12} title="Customers Also Purchased" />
            </div>
          )}
          {activeTab === "Product" && (
            <ProductPage groupByCategory={true} />
          )}
        </div>
      </div>
    </div>
  );
}