import React from 'react';
import { formatCurrency } from '@/core/hooks/useAnimatedCounter';

// Format date
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

export default function OrderCard({ order, onStatusChange, onDelete }) {
  return (
    <div
      key={order.id}
      className="bg-[#F3EBD8] rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Left Section: Order Details */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Created */}
        <div>
          <p className="text-xs font-semibold uppercase text-[#7D5A5A]">Date</p>
          <p className="text-sm font-extrabold text-[#7D5A5A]">{order.tanggal ? formatDate(order.tanggal) : 'No date'}</p>
        </div>
        {/* Customer Name */}
        <div>
          <p className="text-xs font-semibold uppercase text-[#7D5A5A]">Customer</p>
          <p className="text-sm font-extrabold text-[#7D5A5A]">{order.customer_name}</p>
        </div>
        {/* Products */}
        <div>
          <p className="text-xs font-semibold uppercase text-[#7D5A5A]">Products</p>
          <p className="text-sm font-extrabold text-[#7D5A5A]">{order.products_summary || 'No items'}</p>
        </div>
        {/* Total Price */}
        <div>
          <p className="text-xs font-semibold uppercase text-[#7D5A5A]">Total Price</p>
          <p className="text-sm font-extrabold text-[#7D5A5A]">{formatCurrency(order.total_price)}</p>
        </div>
      </div>

      {/* Right Section: Actions & Status */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Payment Proof */}
        {order.bukti_bayar ? (
          <div className="flex gap-2">
            <a
<<<<<<< HEAD
              href={`http://10.69.2.146:3001/uploads/bukti_bayar/${order.bukti_bayar}`}
=======
              href={`http://10.69.2.146:3001/uploads/bukti_bayar/${order.bukti_bayar}`}
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              Open Proof
            </a>
            <a
<<<<<<< HEAD
              href={`http://10.69.2.146:3001/api/order/admin/download/${order.bukti_bayar}`}
=======
              href={`http://10.69.2.146:3001/api/order/admin/download/${order.bukti_bayar}`}
>>>>>>> 3c1703fe75940d04dd70299752eefb07bba523ae
              download
              className="inline-flex items-center bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
            >
              Download
            </a>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No proof</span>
        )}
        
        {/* Status */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase text-center ${
            order.status === 'finish'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
          }`}
        >
          {order.status}
        </span>

        {/* Mark as Finished Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={order.status === 'finish'}
            disabled={order.status === 'finish'}
            onChange={() => onStatusChange(order.id, 'finish')}
            className="w-5 h-5 accent-green-600 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(order.id)}
          className="bg-red-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
}