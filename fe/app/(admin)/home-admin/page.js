"use client";

import React, { useState, useEffect } from 'react';
import { useAnimatedCounter, formatCurrency } from '@/core/hooks/useAnimatedCounter';
import StatCard from '@/components/admin/dashboard/stat-card';
import ProductStatistics from '@/components/admin/dashboard/product-stat';
import LatestOrders from '@/components/admin/dashboard/latest-order';

// Helper function for category colors
// const getCategoryColor = (category) => {
//     switch (category.toLowerCase()) {
//         case 'cake': return '#F5D2D2';
//         case 'bread': return '#F8F7BA';
//         case 'cookies': return '#BDE3C3';
//         case 'pastry': return '#A3CCDA';
//         default: return '#d0a583';
//     }
// };

const HomePage = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        soldProducts: 0,
        pendingOrders: 0,
        finishedOrders: 0,
        productStatistics: []
    });
    
    const [selectedPeriod, setSelectedPeriod] = useState('Hari Ini');
    const [latestOrders, setLatestOrders] = useState([]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders data
                const ordersRes = await fetch("http://localhost:3001/api/order/admin");
                const ordersData = await ordersRes.json();
                
                const totalOrders = ordersData.length;
                const totalSales = ordersData.reduce((sum, order) => sum + order.total_price, 0);
                const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
                const finishedOrders = ordersData.filter(order => order.status === 'finish').length;
                
                const sortedOrders = ordersData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                setLatestOrders(sortedOrders.slice(0, 5));

                // Fetch products data
                const productsRes = await fetch("http://localhost:3001/api/product");
                const productsData = await productsRes.json();
                
                const totalSoldProducts = productsData.reduce((sum, product) => sum + product.stok, 0); 
                
                const categoryCounts = productsData.reduce((acc, product) => {
                    const category = product.kategori;
                    const sold = product.stok;
                    acc[category] = (acc[category] || 0) + sold;
                    return acc;
                }, {});

                const productStatistics = Object.entries(categoryCounts).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value,
                    fill: getCategoryColor(name)
                }));

                setStats({
                    totalSales,
                    totalOrders,
                    soldProducts: totalSoldProducts,
                    pendingOrders,
                    finishedOrders,
                    productStatistics,
                });

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };

        fetchData();
    }, []);

    // Custom Hooks for animated counter
    const animatedSales = useAnimatedCounter(stats.totalSales, 2000);
    const animatedOrders = useAnimatedCounter(stats.totalOrders, 1500);
    const animatedSoldProducts = useAnimatedCounter(stats.soldProducts, 1600);
    const animatedPendingOrders = useAnimatedCounter(stats.pendingOrders, 1000);
    const animatedFinishedOrders = useAnimatedCounter(stats.finishedOrders, 1000);
    
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-second italic text-5xl text-[#878B5A] mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Lacak performa dan penjualan bakerymu</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        title="Total Penjualan"
                        value={formatCurrency(animatedSales)}
                        subtitle="Total pendapatan dari pesanan"
                        growth="+18.2%"
                        color="#F9D0CE"
                        icon="💰"
                    />
                    
                    <StatCard
                        title="Total Pesanan"
                        value={animatedOrders}
                        subtitle="Jumlah pesanan yang masuk"
                        growth="+12.4%"
                        color="#F9D0CE"
                        icon="🛍️"
                    />

                    <StatCard
                        title="Total Produk Terjual"
                        value={animatedSoldProducts}
                        subtitle="Total item yang terjual"
                        growth="+9.8%"
                        color="#F9D0CE"
                        icon="📦"
                    />

                    <StatCard
                        title="Pesanan Pending"
                        value={animatedPendingOrders}
                        subtitle="Pesanan yang belum diproses"
                        growth="-2.1%"
                        color="#EF4444"
                        icon="⏳"
                    />

                    <StatCard
                        title="Pesanan Selesai"
                        value={animatedFinishedOrders}
                        subtitle="Pesanan yang sudah selesai"
                        growth="+5.5%"
                        color="#F9D0CE"
                        icon="✔️"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Statistics */}
                    <ProductStatistics 
                        data={stats.productStatistics} 
                        selectedPeriod={selectedPeriod}
                        setSelectedPeriod={setSelectedPeriod}
                    />

                    {/* Latest Orders */}
                    <LatestOrders orders={latestOrders} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;