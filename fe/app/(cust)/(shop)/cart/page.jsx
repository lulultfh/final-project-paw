"use client";

import React, { useState, useEffect } from "react";
//import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

    useEffect(() => {
    const initializeCart = async () => {
      // 1. Ambil keranjang simpel dari localStorage (hanya ada product_id dan qty)
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (storedCart.length === 0) {
        setIsLoading(false);
        // Tidak perlu set error, cukup tampilkan keranjang kosong
        return;
      }

      try {
        // 2. Ambil semua ID produk untuk diminta detailnya ke server
        const productIds = storedCart.map((item) => item.product_id);

        // 3. Fetch detail produk dari server menggunakan ID yang didapat
        //    Gantilah dengan endpoint Anda yang sebenarnya
<<<<<<< HEAD
        const res = await fetch(`http://10.69.2.146:3001/api/cart`, {
=======
        const res = await fetch(`http://localhost:3001/api/cart`, {
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: productIds }),
        });
        
        if (!res.ok) {
          throw new Error("Gagal mengambil detail produk dari server.");
        }
        
        const productsDetails = await res.json();

        // 4. Gabungkan detail dari server dengan kuantitas dari localStorage
        const detailedItems = productsDetails.map((product) => {
          const cartItem = storedCart.find(item => item.product_id === product.id);
          return {
            ...product, // id, namaProduct, price, image, stok, dll.
            quantity: cartItem ? cartItem.qty : 0,
            selected: true, // Semua item terpilih secara default
          };
        }).filter(item => item.quantity > 0); // Pastikan hanya item valid yang ditampilkan

        setItems(detailedItems);
      } catch (err) {
        setError("Gagal memuat keranjang. Coba muat ulang halaman.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, []);

   const saveCartToLocalStorage = (updatedItems) => {
    const simpleCart = updatedItems.map(item => ({
      product_id: item.id,
      qty: item.quantity
    }));
    localStorage.setItem('cart', JSON.stringify(simpleCart));
  };

  // Toggle select per item
  const toggleSelect = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Pilih semua
  const toggleSelectAll = (checked) => {
    setItems(items.map((item) => ({ ...item, selected: checked })));
  };

  // Hapus item terpilih
  const deleteSelected = () => {
    const remainingItems = items.filter((item) => !item.selected);
    setItems(remainingItems);
    saveCartToLocalStorage(remainingItems); // Simpan perubahan
  };

  const updateQuantity = (id, type) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
        if (newQty < 1) newQty = 1;
        if (newQty > item.stok) newQty = item.stok;
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setItems(updatedItems);
    saveCartToLocalStorage(updatedItems); // Simpan perubahan
  };

  const handleCheckout = () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("Pilih setidaknya satu produk untuk dibeli.");
      return;
    }
  const checkoutItems = selectedItems.map(item => ({
   product_id: item.id,
   namaProduct: item.namaProduct,
   price: item.price,
   quantity: item.quantity,
   image: item.image,
 }));
 localStorage.setItem('itemsForCheckout', JSON.stringify(checkoutItems));

    router.push('/order');
  };

  const total = items
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const allSelected = items.length > 0 && items.every((item) => item.selected);

  if (isLoading) return <div className="p-4 text-center">Loading Cart...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (items.length === 0) return <div className="p-4 text-center">Keranjang Anda Kosong.</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar
      <SidebarLayout /> */}

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="w-full max-w-6xl mx-auto px-6">
          {/* TITLE */}
          <h2 className="text-[50px] font-second italic text-[#878B5A] mb-4">Cart</h2>

          {/* PILIH SEMUA + HAPUS */}
          <div className="flex justify-between items-center font-bold bg-pink-50 px-4 py-2 rounded-lg border border-[#7D5A5A] shadow-sm mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
              <span className="text-[#7D5A5A]">Pilih semua</span>
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
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-[#7D5A5A] bg-[#F8D7D1] p-4 rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                    />
                    <img
<<<<<<< HEAD
                    src={`http://10.69.2.146:3001/api/product/image/${item.image}`} // Gunakan `item.image`
=======
                    src={`http://localhost:3001/api/product/image/${item.image}`} // Gunakan `item.image`
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
                    alt={item.namaProduct} // Gunakan `item.namaProduct`
                    className="w-16 h-16 rounded"
                  />
                    <div>
                    <p className="text-sm text-gray-500">Sisa {item.stok}</p>
                    <p className="font-semibold text-gray-700">{item.namaProduct}</p>
                  </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-bold text-[#7D5A5A]">
                      Rp{item.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center border rounded-full px-2 bg-[#FEFFF1]">
                      <button
                        className="px-2 text-[#7D5A5A] font-bold"
                        onClick={() => updateQuantity(item.id, "dec")}
                      >
                        –
                      </button>
                      <span className="px-3 text-[#7D5A5A] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 text-[#7D5A5A] font-bold"
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
            <div className="w-1/3 bg-[#F8D7D1] p-5 rounded-lg border border-[#7D5A5A] shadow-[0_4px_4px_rgba(0,0,0,0.25)] h-fit">
              <h3 className="text-lg font-semibold mb-3">Ringkasan Pesanan</h3>
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">
                  Rp{total.toLocaleString("id-ID")}
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-2 rounded-lg shadow">
                Beli ({items.filter(i => i.selected).length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
