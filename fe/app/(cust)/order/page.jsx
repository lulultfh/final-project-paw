"use client"; // Diperlukan karena kita menggunakan hooks seperti useState dan useEffect

import React, { useState, useEffect } from 'react';
// --> CATATAN: Baris di bawah ini sengaja dinonaktifkan untuk perbaikan.
// --> Aktifkan kembali di proyek Next.js Anda dan pastikan path-nya benar.
import { useAuth } from '@/app/context/authContext';
// import { useRouter } from 'next/navigation';

export default function OrderPage() {
    const [paymentProofFile, setPaymentProofFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [user, setUser] = useState(null);
    const [itemsToCheckout, setItemsToCheckout] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 

    // --> CATATAN: Baris di bawah ini sengaja dinonaktifkan untuk perbaikan.
    // --> Aktifkan kembali di proyek Anda untuk mendapatkan data user dan fungsi navigasi.
    const { userToken, userData } = useAuth();
    // const router = useRouter();


    useEffect(() => {
        const itemsJSON = localStorage.getItem('itemsForCheckout');
        
        if (!itemsJSON || !userData) {
            setError("Tidak ada item untuk di-checkout atau Anda belum login.");
            setIsLoading(false);
            return;
        }

        try {
            const items = JSON.parse(itemsJSON);
            if (items.length === 0) {
                 setError("Keranjang checkout Anda kosong.");
                 setIsLoading(false);
                 return;
            }

            // 2. Set state dengan data dari localStorage dan Auth Context
            setItemsToCheckout(items);
            setUser(userData);

            // 3. Hitung total harga
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);

        } catch (err) {
            setError("Data keranjang checkout tidak valid.");
        } finally {
            setIsLoading(false);
        }
    }, [userData]); // useEffect akan dijalankan jika userData berubah

    useEffect(() => {
    return () => {
    };
  }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPaymentProofFile(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!paymentProofFile) {
            alert('Harap unggah bukti pembayaran Anda terlebih dahulu.');
            return;
        }
        
        const formData = new FormData();
        const itemsPayload = itemsToCheckout.map(item => ({
            product_id: item.product_id,
            qty: item.quantity,
            subtotal: item.price * item.quantity
        }));

        formData.append('user_id', user.id);
        //formData.append('status', 'process');
        formData.append('paymentProof', paymentProofFile);
        formData.append('items', JSON.stringify(itemsPayload)); 

        try {
            // 2. Kirim data ke endpoint /api/order
            const response = await fetch('http://localhost:3001/api/order', {
                method: 'POST',
                // Untuk FormData, jangan set 'Content-Type' secara manual
                headers: { 
                    'Authorization': `Bearer ${userToken}` // Jika backend butuh otorisasi
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal membuat pesanan.');
            }
            
            // 3. Jika berhasil, bersihkan localStorage dan redirect
            alert('Konfirmasi pembayaran berhasil! Pesanan Anda sedang diproses.');
            localStorage.removeItem('itemsForCheckout');
            
            // 2. Hapus item yang sudah dibeli dari keranjang utama
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemsToRemove = itemsToCheckout.map(item => item.product_id);
        const newCart = currentCart.filter(item => !itemsToRemove.includes(item.product_id));
        localStorage.setItem('cart', JSON.stringify(newCart));

        window.location.href = '/transaction';

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Kolom Kiri */}
                <div className="lg:col-span-2 space-y-8">
                    <h1 className="text-5xl font-light italic text-amber-800">
                        Checkout
                    </h1>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Pelanggan</h2>
                        <p className="text-gray-700 text-lg">{user ? user.name : 'Memuat...'}</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Produk Pesanan</h2>
                        <div className="space-y-6">
                            {itemsToCheckout.map(item => (
                                <div key={item.product_id} className="flex items-center space-x-6">
                                    <img 
                                        src={`http://localhost:3001/api/product/image/${item.image}`} 
                                        alt={item.namaProduct} 
                                        width={100} height={100} 
                                        className="rounded-lg object-cover bg-amber-100" 
                                    />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-lg text-gray-800">{item.namaProduct}</p>
                                        <p className="text-base text-gray-500">{item.quantity} barang x Rp{item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="font-semibold text-lg text-gray-800">
                                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="space-y-8 sticky top-8">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Konfirmasi Pembayaran</h2>
                            <div className="bg-amber-50 rounded-lg p-4 mb-6 text-center">
                                <p className="text-base text-amber-800">Silakan lakukan transfer ke rekening berikut:</p>
                                <p className="font-bold text-xl text-amber-900 mt-1">BCA - 1234567890</p>
                                <p className="text-base text-amber-800">a/n Butter&Bliss</p>
                            </div>
                            
                            <label htmlFor="payment-proof" className="block w-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition-colors">
                                <span className="text-amber-700 font-semibold text-lg">Unggah Bukti Pembayaran</span>
                                <span className="mt-1 block text-sm text-gray-500">Wajib diisi</span>
                            </label>
                            <input 
                                type="file" 
                                id="payment-proof" 
                                className="hidden"
                                accept="image/*" 
                                onChange={handleFileChange}
                                required 
                            />
                            {fileName && <p className="text-base text-center text-gray-600 mt-3">File: {fileName}</p>}
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold border-b pb-4 mb-6">Ringkasan Belanja</h2>
                            <div className="flex justify-between text-base text-gray-600">
                                <span>Total Harga</span>
                                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-amber-900 mt-4 pt-4 border-t">
                                <span>Total Tagihan</span>
                                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        
                        <button type="submit" className="w-full bg-amber-800 text-white font-bold py-4 rounded-lg text-lg hover:bg-amber-900 transition-colors shadow-lg">
                            Konfirmasi Pembayaran
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}