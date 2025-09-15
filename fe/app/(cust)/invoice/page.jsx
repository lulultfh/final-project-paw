"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';

// Komponen untuk loading spinner sederhana
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-800"></div>
        <p className="mt-4 text-lg text-gray-600">Memuat Invoice...</p>
    </div>
);

export default function InvoicePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id');

    const [invoiceData, setInvoiceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const invoiceRef = useRef();

    useEffect(() => {
        if (!orderId) {
            setError("ID Order tidak ditemukan.");
            setIsLoading(false);
            return;
        }

        const fetchInvoice = async () => {
            try {
                // Ganti URL jika backend Anda berbeda
                const response = await fetch(`http://10.49.3.154:3001/api/order/invoice/${orderId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengambil data invoice.');
                }
                const data = await response.json();
                console.log("Data invoice diterima dari backend:", data);
                setInvoiceData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [orderId]);

    const handleDownloadPng = async () => {
        if (!invoiceRef.current) {
            alert("Komponen invoice tidak ditemukan.");
            return;
        }
        if (!invoiceData) {
            alert("Data invoice belum siap untuk diunduh.");
            return;
        }
        // [PERBAIKAN] Pengecekan spesifik untuk ID
        if (!invoiceData.id) {
            console.error("Invoice Data tidak memiliki 'id'", invoiceData);
            alert("Gagal membuat nama file: ID invoice tidak ditemukan.");
            return;
        }
        setIsDownloading(true);
        console.log("Memulai proses download PNG...");
        try {
            const imgDataUrl = await toPng(invoiceRef.current, { 
                cacheBust: true, 
                pixelRatio: 2 // Mirip dengan 'scale: 2' untuk kualitas lebih tinggi
            });
            console.log("Kanvas berhasil dibuat.");
            

            // Membuat link sementara untuk memicu download
            const link = document.createElement('a');
            link.href = imgDataUrl;
            link.download = `invoice-${invoiceData.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("Download seharusnya sudah dimulai.");
        } catch (err) {
            console.error("Gagal saat proses html2canvas atau download:", err);
            alert("Gagal mengunduh gambar invoice. Pastikan CORS di backend sudah aktif.");
        } finally {
            setIsDownloading(false);
        }
    };
    
    const handleClose = () => {
        router.push('/transaction');
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <main className="w-full max-w-3xl">
                {/* INI ADALAH AREA KANVAS UNTUK INVOICE */}
                <div ref={invoiceRef} className="bg-white p-8 sm:p-12 shadow-lg">
                    <header className="flex justify-between items-start pb-8 border-b-2 border-gray-100">
                        <div>
                            <h1 className="text-4xl font-bold text-amber-900">INVOICE</h1>
                            <p className="text-gray-500">Order ID: #{invoiceData?.id}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-light italic text-amber-800">Butter&Bliss</h2>
                            <p className="text-gray-500 text-sm">Pemesanan Berhasil</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-8 my-8">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Ditagihkan kepada:</h3>
                            <p className="text-gray-600">{invoiceData?.user_name}</p>
                            <p className="text-gray-600">{invoiceData?.user_email}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-semibold text-gray-800 mb-2">Tanggal Invoice:</h3>
                            <p className="text-gray-600">{invoiceData && new Date(invoiceData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </section>
                
                    <section>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Produk</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">Jumlah</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Harga Satuan</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData?.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-4 font-medium text-gray-800">{item.namaProduct}</td>
                                        <td className="p-4 text-gray-600 text-center">{item.qty}</td>
                                        <td className="p-4 text-gray-600 text-right">Rp{item.subtotal && item.qty ? (item.subtotal / item.qty).toLocaleString('id-ID') : '0'}</td>
                                        <td className="p-4 text-gray-600 text-right">Rp{item.subtotal.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                
                    <section className="mt-8 flex justify-end">
                        <div className="w-full max-w-xs text-gray-700 space-y-3">
                            <div className="flex justify-between font-bold text-xl text-amber-900 border-t-2 pt-4">
                                <span>Total</span>
                                <span>Rp{invoiceData?.total_price ? invoiceData.total_price.toLocaleString('id-ID') : '0'}</span>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-12 pt-8 border-t-2 text-center text-gray-500 text-sm">
                        <p>Terima kasih telah berbelanja di Butter&Bliss!</p>
                    </footer>
                </div>

                 {/* TOMBOL AKSI DI LUAR KANVAS */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={handleDownloadPng}
                        disabled={isDownloading}
                        className="w-full sm:w-auto bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400"
                    >
                     {isDownloading ? 'Memproses...' : 'Download'}
                     </button>
                    <button 
                        onClick={handleClose}
                        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </main>
        </div>
    );
}