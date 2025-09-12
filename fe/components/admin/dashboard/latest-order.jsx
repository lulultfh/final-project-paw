import React from "react";
import { formatCurrency } from "@/core/hooks/useAnimatedCounter";

const LatestOrders = ({ orders }) => (
  <div
    className="rounded-2xl p-6 shadow-lg bg-[#F3EBD8]"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Pesanan Terbaru
        </h2>
        <p className="text-gray-600 text-sm">Lihat pesanan yang baru masuk</p>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#D5CAB1]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatCurrency(order.total_price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "finish"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
              >
                Tidak ada pesanan terbaru.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default LatestOrders;
