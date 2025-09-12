// import SidebarLayoutAdmin from "@/components/admin/sidebar";

// export default function HomePage() {
//   return (
//     <div style={{ display: "flex" }}>
//       <SidebarLayoutAdmin />
//       <div className="flex-1 flex justify-center items-start p-6">
//         {/* <Carousel /> */}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function ManageOrderPage() {
  const [orders, setOrders] = useState([]);

  // Ambil data order dari backend
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/order/admin");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/order/admin")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Handle update status order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/order/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders(); // Refresh data setelah update
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Handle delete order
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/order/${id}`, { method: "DELETE" });
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (number) => {
    if (number === null || number === undefined) {
      return 'Rp 0';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

   useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* <SidebarLayoutAdmin /> */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>

        {/* Orders Table */}
        <table className="w-full border-collapse bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              {/* <th className="p-2">Order ID</th> */}
              <th className="p-2">Date Created</th>
              <th className="p-2">Customer Name</th>
              <th className="p-2">Products</th>
              <th className="p-2">Total Price</th>
              <th className="p-2">Payment Proof</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Mark as Finished</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                {/* <td className="p-2 font-semibold">#{order.id}</td> */}
                <td className="p-2 text-gray-600">
                  {order.tanggal ? formatDate(order.tanggal) : 'No date'}
                </td>
                <td className="p-2 font-medium">{order.customer_name}</td>
                <td className="p-2 text-gray-700 text-sm">
                  {order.products_summary || 'No items'} {/* <-- DATA BARU */}
                </td>
                <td className="p-2 text-gray-800 font-semibold">{formatCurrency(order.total_price)}</td>
                <td className="p-2">
                  {order.bukti_bayar ? (
                    <div className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-1">
                      {/* Tombol Open */}
                      <a
                        href={`http://localhost:3001/uploads/${order.bukti_bayar}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        Open
                      </a>
                      {/* Tombol Download */}
                      <a
                        href={`http://localhost:3001/api/order/admin/download/${order.bukti_bayar}`}
                        download
                        className="text-center bg-gray-500 text-white px-2 py-1 text-xs rounded hover:bg-gray-600 transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No proof</span>
                  )}
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'finish'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={order.status === 'finish'}
                      disabled={order.status === 'finish'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleStatusChange(order.id, 'finish');
                        }
                      }}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}