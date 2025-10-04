'use client';

import { Order } from '@/types/order';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import OrderItemsTable from './OrderItemsTable';

type Props = {
  order: Order;
  onClose: () => void;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  received: { label: 'Reçue', color: 'bg-green-100 text-green-800' },
  delivered: { label: 'Livrée', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Payée', color: 'bg-purple-100 text-purple-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
};

export default function OrderDetails({ order, onClose }: Props) {
  const status = statusLabels[order.status];

  return (
    <div className="relative w-full">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Commande #{order.order_id.slice(-5)}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {format(new Date(order.created_at), "dd MMM yyyy HH:mm", { locale: fr })}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Réservation</h3>
          <div className="text-sm text-gray-800">
            {order.res_name ? <>{order.res_name}</> : <span className="italic text-gray-400">–</span>}
          </div>
          {/* Optionnel: lien vers la fiche résa */}
          {order.reservation_id && (
            <div className="mt-1">
              <a
                href={`/admin/bookings/${order.reservation_id}`}
                className="text-green-600 text-xs font-semibold hover:underline"
              >
                Voir la réservation
              </a>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Produits</h3>
          <OrderItemsTable items={order.items} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm">
              Marquer comme livrée
            </button>
          )}
          {order.status !== 'cancelled' && (
            <button className="px-4 py-2 rounded bg-red-50 text-red-600 font-medium hover:bg-red-100 border border-red-200 text-sm">
              Annuler la commande
            </button>
          )}
        </div>
      </div>
    </div>
  );
}