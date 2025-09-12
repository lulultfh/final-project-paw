import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

// Fungsi untuk memformat angka
const formatNumber = (number) => {
    return number.toLocaleString();
};

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Custom Hook untuk animasi counter
const useAnimatedCounter = (endValue, duration) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;

        const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const value = Math.floor(progress * endValue);
            setCount(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [endValue, duration]);

    return count;
};

// Komponen Card Statistik
const StatCard = ({ title, value, subtitle, growth, color, icon }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl`}
                style={{ backgroundColor: color }}>
                {icon}
            </div>
            {growth && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    growth.includes('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {growth}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {subtitle && (
                <p className="text-gray-500 text-sm">{subtitle}</p>
            )}
        </div>
    </div>
);

// Komponen Utama
const BakeryDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        soldProducts: 0,
        pendingOrders: 0,
        finishedOrders: 0,
        productStatistics: []
    });
    
    const [selectedPeriod, setSelectedPeriod] = useState('Today');
    const [latestOrders, setLatestOrders] = useState([]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders data
                const ordersRes = await fetch("http://localhost:3001/api/order/admin");
                const ordersData = await ordersRes.json();
                
                // Calculate stats from orders
                const totalOrders = ordersData.length;
                const totalSales = ordersData.reduce((sum, order) => sum + order.total_price, 0);
                const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
                const finishedOrders = ordersData.filter(order => order.status === 'finish').length;
                
                // Sort orders by date to get the latest 5
                const sortedOrders = ordersData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                setLatestOrders(sortedOrders.slice(0, 5));

                // Fetch products data
                const productsRes = await fetch("http://localhost:3001/api/product");
                const productsData = await productsRes.json();
                
                // Calculate sold products and category stats
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
    
    // Helper function for category colors
    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'cake': return '#4F46E5';
            case 'bread': return '#EF4444';
            case 'cookies': return '#10B981';
            case 'pastry': return '#F59E0B';
            default: return '#6B7280';
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🍰 Sweet Bakery Dashboard</h1>
                    <p className="text-gray-600">Track your bakery performance and sales</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        title="Total Sales"
                        value={formatCurrency(animatedSales)}
                        subtitle="Total pendapatan dari pesanan"
                        growth="+18.2%"
                        color="#4F46E5"
                        icon="💰"
                    />
                    
                    <StatCard
                        title="Total Orders"
                        value={animatedOrders}
                        subtitle="Jumlah pesanan yang masuk"
                        growth="+12.4%"
                        color="#10B981"
                        icon="🛍️"
                    />

                    <StatCard
                        title="Total Produk Terjual"
                        value={animatedSoldProducts}
                        subtitle="Total item yang terjual"
                        growth="+9.8%"
                        color="#F59E0B"
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
                        color="#4B5563"
                        icon="✔️"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Statistics */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Product Statistics</h2>
                                <p className="text-gray-600 text-sm">Track your product sales</p>
                            </div>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Today</option>
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        
                        <ResponsiveContainer width="100%" height={300}>
                            <RadialBarChart
                                innerRadius="10%"
                                outerRadius="80%"
                                data={stats.productStatistics}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                    minAngle={15}
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    clockWise
                                    dataKey="value"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Latest Orders */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Pesanan Terbaru</h2>
                                <p className="text-gray-600 text-sm">Lihat pesanan yang baru masuk</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {latestOrders.length > 0 ? (
                                        latestOrders.map((order, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{formatCurrency(order.total_price)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            order.status === 'finish' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                Tidak ada pesanan terbaru.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BakeryDashboard;
