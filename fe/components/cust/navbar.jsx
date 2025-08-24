"use client";

import React, { useState } from "react";
import ForYou from "./foryou";
import ProductCard from "./ui/card";

export default function NavbarCustMenu() {
  const [activeTab, setActiveTab] = useState("ForYou");

  const navItem = [
    { name: "ForYou", id: "foryou" },
    { name: "Product", id: "product" },
  ];
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4">
        {/* Searchbar */}
        {/* Cart */}
        {/* Profile */}
        {/* Navigation */}
        <nav className="flex justify-center items-center py-4">
          {" "}
          //ini biar di tengah
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.name)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === item.name
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.name}
                {activeTab === item.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* for you card */}
        {activeTab === "ForYou" && (
          <div className="flex justify-center items-center min-h-screen">
            <ForYouCard />
          </div>
        )}
        {/* product card */}
        {activeTab === "Product" && (
          <div className="flex justify-center items-center min-h-screen">
            <ProductCard />
          </div>
        )}
      </div>
    </div>
  );
}
