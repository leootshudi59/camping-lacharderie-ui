'use client';

import { useState } from 'react';
import { mockOrders } from '@/mocks/mockOrders';
import { Order } from '@/types/order';
import OrderDetails from './OrderDetails';

const statusColors: Record<string, string> = {
  received: 'bg-green-100 text-green-800',
  delivered: 'bg-blue-100 text-blue-800',
  paid: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderList() {
  const [orders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock filtre commandes du jour
  const [filterToday, setFilterToday] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const filteredOrders = filterToday
    ? orders.filter((o) => o.created_at.slice(0, 10) === today)
    : orders;

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        <button
          onClick={() => setFilterToday((v) => !v)}
          className={`px-4 py-2 bg-white text-green-700 border border-green-200 rounded-lg text-sm font-medium shadow-sm hover:bg-green-50 transition ${
            filterToday ? '!bg-green-600 !text-white !border-green-600 hover:!bg-green-700' : ''
          }`}
        >
          {filterToday ? "Toutes les commandes" : "Commandes du jour"}
        </button>
      </div>

      {/* Vue tableau (desktop) */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                N°
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Réservation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.order_id} className="hover:bg-green-50 transition">
                <td className="px-4 py-3 font-mono font-medium">#{order.order_id.slice(-5)}</td>
                <td className="px-4 py-3">{order.res_name || <span className="italic text-gray-400">–</span>}</td>
                <td className="px-4 py-3">{order.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    className="p-2 rounded hover:bg-green-100"
                    onClick={() => handleViewClick(order)}
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile (card) */}
      <div className="space-y-4 sm:hidden">
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-xl shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-gray-500 block mb-1">
                  #{order.order_id.slice(-5)}
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  {order.res_name || <span className="italic text-gray-400">–</span>}
                </h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">{order.created_at.slice(0, 10)}</div>
            <div className="flex justify-end pt-2">
              <button
                className="p-2 rounded hover:bg-green-100"
                onClick={() => handleViewClick(order)}
              >
                Voir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {detailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-0 shadow-lg relative animate-in fade-in zoom-in-90">
            <OrderDetails order={selectedOrder} onClose={() => setDetailsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
