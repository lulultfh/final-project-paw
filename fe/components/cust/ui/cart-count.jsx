"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/cart");
        const data = await res.json();

        const totalItems = data.reduce((acc, item) => acc + item.quantity, 0); // hitung jumlah item
        setCount(totalItems);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="relative">
      <Image
        src="/shop.svg"
        alt="Cart"
        width={24}
        height={24}
        className="w-6 h-6"
      />

      {/* badge count */}
      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          style={{ backgroundColor: "#F76079" }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
