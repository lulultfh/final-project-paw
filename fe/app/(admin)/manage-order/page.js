"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/admin/manage/OrderCard";

export default function ManageOrderPage() {
  const [orders, setOrders] = useState([]);

  // Fetch order data from the backend
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
    fetchOrders();
  }, []);

  // Handle order status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/order/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Handle order deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await fetch(`http://localhost:3001/api/order/${id}`, { method: "DELETE" });
        fetchOrders();
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/order/admin/download-pdf", {
        method: "GET",
        headers: { "Content-Type": "application/pdf" },
      });

      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "OrderList.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* <SidebarLayoutAdmin /> */}
      <div className="flex-1 p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-second italic text-[#878B5A]">Manage Order</h1>
            <p className="text-gray-500 mt-1">View and manage all customer orders.</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-[#878B5A] text-white px-4 py-2 rounded-lg hover:bg-[#6A6E48] transition-colors"
          >
            Download PDF
          </button>
        </div>

        {orders.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}