"use client";
import Carousel from "@/components/cust/ui/carousel";
import ProductPage from "./(shop)/product/page";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("ForYou");

  const navItems = [
    { name: "ForYou", id: "foryou" },
    { name: "Product", id: "product" },
  ];

  return (
    <div className="w-full flex flex-col justify-start items-center">
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
      <div className="mt-6 w-full flex flex-col items-center">
        {activeTab === "ForYou" && (
          <div className="flex flex-col justify-start items-center max-w-6xl mx-auto px-8">
            <Carousel />
            <ProductPage
              limit={12}
              className="-mt-20"
              title={
                <span className="text-4xl font-second font-light text-[#878B5A]">
                  <span className="text-6xl font-second font-light italic text-[#878B5A]">B</span>
                  aked with love, served with joy
                </span>
              }
            />
          </div>
        )}
        {activeTab === "Product" && <ProductPage groupByCategory={true} />}
      </div>
    </div>
  );
}
