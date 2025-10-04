'use client';

import { useEffect, useState } from 'react';
import { mockOrders } from '@/mocks/mockOrders'; // Assure-toi du bon chemin
import { CalendarDays, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Order } from '@/types/order';

type ReservationUser = {
    name: string;
    reservationNumber: string;
    rentalName: string;
    endDate: string;
};

const statusLabels: Record<string, { label: string; color: string; icon: React.JSX.Element }> = {
  received: {
    label: 'Reçue',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="w-4 h-4 mr-1" />,
  },
  delivered: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
  },
  // Ajoute d'autres statuts si besoin
};

export default function OrdersPage() {
  const [user, setUser] = useState<ReservationUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération de l'utilisateur depuis le localStorage
    try {
      const data = localStorage.getItem('reservationUser');
      if (data) setUser(JSON.parse(data));
    } catch {}
  }, []);

  useEffect(() => {
    if (!user) return;
    // Filtrer les commandes correspondant à la réservation du campeur
    setLoading(true);
    setTimeout(() => {
      const filtered = mockOrders.filter((order) => order.reservation_id === user.reservationNumber);
      setOrders(filtered);
      setLoading(false);
    }, 400); // Simule un chargement
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-7 h-7 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Mon historique de commandes
      </h1>

      {orders.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 px-4 py-4 rounded-lg text-center">
          <span>Vous n'avez pas encore passé de commande.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-white rounded-xl shadow p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-1">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <CalendarDays className="w-4 h-4 text-green-600" />
                  <span>
                    Commande du{' '}
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[order.status]?.color || ''}`}>
                  {statusLabels[order.status]?.icon}
                  {statusLabels[order.status]?.label || order.status}
                </span>
              </div>
              <ul className="divide-y divide-gray-100 mb-2">
                {order.items.map((item) => (
                  <li key={item.order_item_id} className="flex justify-between py-1 text-gray-700">
                    <span>{item.product_name}</span>
                    <span className="font-semibold">{item.quantity}</span>
                  </li>
                ))}
              </ul>
              {/* Ajoute ici d'autres infos si besoin (statut, total, etc) */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}