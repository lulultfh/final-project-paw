"use client";

import React, { useState } from "react";
import SearchBar from "./search";
import ForYou from "./foryou";
import ProductCard from "./ui/card";
import CartCount from "./ui/cart-count";

export default function NavbarCustMenu() {
  const [activeTab, setActiveTab] = useState("ForYou");

  const navItems = [
    { name: "ForYou", id: "foryou" },
    { name: "Product", id: "product" },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6 ml-6">
            {/* Cart */}
            <CartCount />

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Profile Avatar */}
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
            <div className="flex justify-center items-center min-h-screen">
              <ForYou />
            </div>
          )}
          {activeTab === "Product" && (
            <div className="flex justify-center items-center min-h-screen">
              <ProductCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
