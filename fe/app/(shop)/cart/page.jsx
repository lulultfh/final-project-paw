"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/cust/sidebar";
import { ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Cookies", price: 25000, stock: 4, quantity: 2, selected: true },
    { id: 2, name: "Cookies", price: 25000, stock: 4, quantity: 2, selected: false },
    { id: 3, name: "Cookies", price: 25000, stock: 4, quantity: 2, selected: false },
    { id: 4, name: "Cookies", price: 25000, stock: 4, quantity: 2, selected: false },
  ]);

  // Toggle select per item
  const toggleSelect = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  // Pilih semua
  const toggleSelectAll = (checked) => {
    setItems(items.map(item => ({ ...item, selected: checked })));
  };

  // Hapus item terpilih
  const deleteSelected = () => {
    setItems(items.filter(item => !item.selected));
  };

  // Update quantity
  const updateQuantity = (id, type) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
        if (newQty < 1) newQty = 1;
        if (newQty > item.stock) newQty = item.stock;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const allSelected = items.length > 0 && items.every(item => item.selected);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarLayout />

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col gap-6 bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="What’s your flavour today?"
            className="w-1/2 px-4 py-2 rounded-full border focus:outline-none shadow-sm"
          />
          <div className="flex items-center gap-6">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1">
                15
              </span>
            </div>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-serif text-gray-700 mb-4">Cart</h2>

        {/* PILIH SEMUA + HAPUS */}
        <div className="flex justify-between items-center bg-pink-50 px-4 py-2 rounded-lg border shadow-sm mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <span className="text-gray-700">Pilih semua</span>
          </label>
          <button
            onClick={deleteSelected}
            className="text-red-500 font-semibold hover:underline"
          >
            Hapus
          </button>
        </div>

        {/* CART SECTION */}
        <div className="flex gap-6">
          {/* LIST ITEM */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-pink-100 p-4 rounded-lg shadow-sm border"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                  />
                  <img
                    src="https://i.ibb.co/S0q4y1N/cookie.png"
                    alt={item.name}
                    className="w-16 h-16 rounded"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Sisa {item.stock}</p>
                    <p className="font-semibold text-gray-700">{item.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-bold text-gray-700">
                    Rp{item.price.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center border rounded-full px-2 bg-white">
                    <button
                      className="px-2 text-lg"
                      onClick={() => updateQuantity(item.id, "dec")}
                    >
                      –
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      className="px-2 text-lg"
                      onClick={() => updateQuantity(item.id, "inc")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RINGKASAN PESANAN */}
          <div className="w-1/3 bg-pink-100 p-5 rounded-lg border shadow-sm h-fit">
            <h3 className="text-lg font-semibold mb-3">Ringkasan Pesanan</h3>
            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="font-bold">
                Rp{total.toLocaleString("id-ID")}
              </span>
            </div>
            <button className="w-full bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-2 rounded-lg shadow">
              Beli
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
