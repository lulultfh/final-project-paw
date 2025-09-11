"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("All");

  const transactions = [
    {
      id: 1,
      type: "Shop",
      date: "12 Aug 25",
      status: "Finish",
      product: {
        name: "Cheese Cake",
        image: "/api/placeholder/60/60",
        quantity: 2,
        price: 26000,
        total: 52000,
      },
    },
    {
      id: 2,
      type: "Shop",
      date: "12 Aug 25",
      status: "Process",
      product: {
        name: "Cheese Cake",
        image: "/api/placeholder/60/60",
        quantity: 2,
        price: 26000,
        total: 52000,
      },
    },
  ];

  const tabs = ["All", "Process", "Finish"];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "All") {
      return true;
    }
    return transaction.status === activeTab;
  });

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <h1 className="text-[50px] font-second italic text-[#878B5A] mb-8">
          Transaction List
        </h1>

        {/* Status Tabs */}
        <div className="flex space-x-8 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-bold text-sm transition-colors relative ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-[#FF9494]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-5">
                {/* Transaction Icon */}
                <div className="bg-gray-100 p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </div>

                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={transaction.product.image}
                    alt={transaction.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-amber-100"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml," +
                        encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                          <rect width="64" height="64" fill="#f4e6d1"/>
                          <path d="M16 48 L48 48 L45 27 L19 27 Z" fill="#e6d2a3"/>
                          <ellipse cx="32" cy="37" rx="13" ry="9" fill="#fff8e1"/>
                        </svg>
                      `);
                    }}
                  />
                </div>

                {/* Transaction Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm text-black font-bold">
                      {transaction.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {transaction.date}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        transaction.status === "Finish"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      #{transaction.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {transaction.product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {transaction.product.quantity} barang x{" "}
                    {formatCurrency(transaction.product.price)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Total Belanja</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(transaction.product.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
