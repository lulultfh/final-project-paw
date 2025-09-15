"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Link from 'next/link';

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Ambil data user yang login dari localStorage
    // Saya berasumsi Anda menyimpan info user dengan key 'user' setelah login
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    // 2. Jika tidak ada user yang login, jangan lakukan apa-apa
    if (!loggedInUser) {
      setError("Anda harus login untuk melihat riwayat transaksi.");
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        // 3. Tambahkan userId sebagai query parameter di URL fetch
        const response = await fetch(`/api/order?userId=${loggedInUser.id}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

  const tabs = ["All", "Process", "Finish"];

  // Fungsi format mata uang tetap sama
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  // Fungsi untuk format tanggal dari API
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "2-digit" };
    // Menggunakan en-GB agar formatnya DD Mon YY (e.g., 12 Aug 25)
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Fungsi untuk mengubah huruf pertama menjadi kapital (misal: "process" -> "Process")
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Transformasi dan filter data
  const filteredTransactions = transactions.filter((order) => {
    const orderStatus = capitalizeFirstLetter(order.status);
    if (activeTab === "All") {
      return true;
    }
    return orderStatus === activeTab;
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

        <div className="space-y-6">
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((order) => (
              <div
                key={order.id}
                className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-black font-bold">Shop</span>
                    <span className="text-xs text-gray-400">
                      {formatDate(order.tanggal)}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        capitalizeFirstLetter(order.status) === "Finish"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      #{capitalizeFirstLetter(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Belanja</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(order.total_price)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.product_id}`}
                      className="flex items-center space-x-5"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={`http://10.49.3.154:3001/api/product/image/${item.image}`}
                          alt={item.namaProduct}
                          className="w-16 h-16 rounded-lg object-cover bg-amber-100"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.namaProduct}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.qty} barang x{" "}
                          {formatCurrency(item.subtotal / item.qty)}
                        </p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-md font-medium text-gray-800">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            <Link 
                                href={`/invoice?id=${order.id}`}
                                className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-amber-900 transition-colors"
                            >
                                Lihat Invoice
                            </Link>
                        </div>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}