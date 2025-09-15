"use client";

export async function getAllProducts() {
  try {
    const res = await fetch("http://10.49.3.154:3001/api/product", {
      cache: "no-store", // Penting agar data selalu terbaru
    });
    if (!res.ok) {
      throw new Error("Gagal mengambil data produk dari server");
    }
    return res.json();
  } catch (error) {
    console.error("Error di getAllProducts:", error);
    // Kembalikan array kosong jika terjadi error agar aplikasi tidak crash
    return []; 
  }
}

/**
 * Mengambil satu produk berdasarkan ID-nya dari API.
 * @param {string} id - ID dari produk yang akan diambil.
 */
export async function getDataById(id) {
  try {
    const res = await fetch(`http://10.49.3.154:3001/api/product/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Gagal mengambil detail produk");
    }
    return res.json();
  } catch (error) {
    console.error(`Error di getDataById untuk id ${id}:`, error);
    // Kembalikan null atau objek kosong jika produk tidak ditemukan
    return null;
  }
}

export const addToCart = (product) => {
  try {
    if (!product || !product.id || !product.namaProduct) {
        console.error("Produk tidak valid:", product);
        alert("Tidak bisa menambahkan produk yang tidak valid ke keranjang.");
        return false;
    }

    // 1. Ambil keranjang yang sudah ada dari localStorage.
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // 2. Cek apakah produk sudah ada di keranjang.
    const existingProductIndex = cart.findIndex(item => item.product_id === product.id);

    if (existingProductIndex > -1) {
      // Jika sudah ada, tambah kuantitasnya (qty).
      cart[existingProductIndex].qty += 1;
    } else {
      // Jika belum ada, tambahkan produk baru ke keranjang.
      cart.push({
        product_id: product.id,
        qty: 1
      });
    }

    // 3. Simpan kembali keranjang yang sudah diperbarui ke localStorage.
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Beri notifikasi (opsional, tapi sangat direkomendasikan)
    alert(`"${product.namaProduct}" telah ditambahkan ke keranjang!`);
    
    return true; // Menandakan sukses

  } catch (error) {
    console.error("Gagal menambahkan ke keranjang:", error);
    alert("Oops! Terjadi kesalahan saat menambahkan produk ke keranjang.");
    return false; // Menandakan gagal
  }
};
