'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle, Clock, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/ui/Loader';
import OrderForm from './OrderForm';

type GuestOrderItem = {
    order_item_id: string;
    quantity: number;
    products?: {
        name: string;
    } | null;
};

type GuestOrder = {
    order_id: string;
    created_at: string;
    status: string;
    order_items: GuestOrderItem[];
};

type ReservationCard = {
    name: string;
    bookingId: string;
    bookingNumber: string;
    rentalName: string;
    endDate: string;
};

const mapToCard = (b: any): ReservationCard => ({
    name: b?.res_name ?? b?.resName ?? '',
    bookingId: b?.booking_id ?? b?.bookingId ?? '',
    bookingNumber: b?.booking_number ?? b?.bookingNumber ?? '',
    rentalName: b?.campsite_name ?? b?.campsiteName ?? '',
    endDate: b?.end_date
        ? new Date(b.end_date).toLocaleDateString('fr-FR')
        : (b?.endDate ?? ''),
});

const statusLabels: Record<
    string,
    { label: string; color: string; icon: React.JSX.Element }
> = {
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
    // tu peux compléter si besoin (paid, cancelled…)
};

export default function UserGuestOrderList() {
    const { guestToken, guestBooking, logoutGuest } = useAuth();

    const [card, setCard] = useState<ReservationCard | null>(
        guestBooking ? mapToCard(guestBooking) : null
    );
    const [orders, setOrders] = useState<GuestOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);


    // 1) On reconstruit la "carte" de réservation à partir du guestBooking
    useEffect(() => {
        (async () => {
            if (!guestToken) return;

            // Si on a déjà le booking dans le context, on le prend
            if (guestBooking) {
                setCard(mapToCard(guestBooking));
                return;
            }

            // fallback : relecture locale + refetch API (comme dans ClientHome)
            try {
                const raw = localStorage.getItem('guest_booking');
                const gb = raw ? JSON.parse(raw) : null;
                const id = gb?.booking_id;
                if (!id) return;

                const r = await fetch(`/api/guest/bookings/${id}`, {
                    headers: { Authorization: `Bearer ${guestToken}` },
                });
                if (r.status === 401) {
                    logoutGuest();
                    return;
                }
                const j = await r.json();
                if (!r.ok) throw new Error(j?.error || 'Erreur');
                setCard(mapToCard(j));
            } catch {
                // tu peux mettre un toast si tu veux
            }
        })();
    }, [guestToken, guestBooking, logoutGuest]);

    // 2) Fetch des commandes pour cette réservation
    useEffect(() => {
        if (!guestToken || !card?.bookingId) return;

        const fetchOrders = async () => {
            try {
                console.log("Guest token", guestToken);
                setLoading(true);
                setError(null);

                const r = await fetch(`/api/guest/bookings/${card.bookingId}/orders`, {
                    headers: { Authorization: `Bearer ${guestToken}` },
                });
                const data = await r.json();
                console.log("orders", data);
                if (!r.ok) {
                    throw new Error(data?.error || 'Erreur lors du chargement des commandes');
                }
                setOrders(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [guestToken, card?.bookingId, logoutGuest]);

    if (!guestToken) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
                Vous devez être connecté en tant que campeur pour voir vos commandes.
            </div>
        );
    }

    if (loading) return <Loader className="h-56" />;

    if (error) {
        return (
            <div className="text-center text-red-600 my-6">
                Impossible de charger les commandes : {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl font-bold text-green-700 text-center sm:text-left">
                    Mon historique de commandes
                </h1>
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 transition w-full sm:w-auto"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Nouvelle commande</span>
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 px-4 py-4 rounded-lg text-center">
                    Vous n'avez pas encore passé de commande.
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
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[order.status]?.color || ''
                                        }`}
                                >
                                    {statusLabels[order.status]?.icon}
                                    {statusLabels[order.status]?.label || order.status}
                                </span>
                            </div>

                            <ul className="divide-y divide-gray-100 mb-2">
                                {order.order_items.map((item) => (
                                    <li
                                        key={item.order_item_id}
                                        className="flex justify-between py-1 text-gray-700"
                                    >
                                        <span>{item.products?.name ?? 'Produit'}</span>
                                        <span className="font-semibold">{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <OrderForm
                    bookingId={card?.bookingId}
                    token={guestToken}
                    onClose={() => setModalOpen(false)}
                    onCreated={(newOrder) => {
                        setOrders((prev) => [newOrder, ...prev]);
                        setModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}