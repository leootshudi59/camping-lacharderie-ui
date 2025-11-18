'use client';

import { useEffect, useState } from 'react';
import { mockOrders } from '@/mocks/mockOrders'; // Assure-toi du bon chemin
import { CalendarDays, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Order } from '@/types/order';
import UserGuestOrderList from '@/components/orders/UserGuestOrderList';

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
  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8">
      <UserGuestOrderList />
    </div>
  );
}