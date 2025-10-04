'use client';

import { CalendarDays, Mail, Phone, User2, ArrowLeft, ClipboardList } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Booking } from '@/types/reservation';
import Loader from '../ui/Loader';
import { InventoryItemUI, InventorySummary } from '@/types/inventory';
import InventoryFormModal, { InventoryFormData } from '../inventories/InventoryForm';

type ReservationDetailsProps = {
    // reservation: {
    //     booking_id: string;
    //     resName: string;
    //     campsite_id: string;
    //     campsiteName: string;
    //     email?: string;
    //     phone?: string;
    //     startDate: string;
    //     endDate: string;
    //     lastInventoryId?: string;
    // };
    booking_id: string;
    mode?: 'admin' | 'client';
};

const mockInventories = [
    {
        id: '1',
        reservationId: '1',
        type: 0, // entrée
        createdAt: '2025-07-10',
        comment: 'Inventaire d\'arrivée : tout est en bon état.',
        items: [
            { inventoryItemId: '1', name: 'Chaises', quantity: 4, condition: 'Une des chaises a un pied qui boite' },
            { inventoryItemId: '2', name: 'Table', quantity: 1, condition: 'Neuf' },
        ],
    },
    {
        id: '2',
        reservationId: '2',
        type: 0, // entrée
        createdAt: '2025-07-19',
        comment: 'Inventaire d\'arrivée : tout est en bon état.',
        items: [
            { inventoryItemId: '3', name: 'Tente', quantity: 1, condition: 'Usé' },
        ],
    },
    {
        id: '3',
        reservationId: '2',
        type: 1, // sortie
        createdAt: '2025-07-19',
        comment: 'Inventaire de départ : meubles rendus sans dommage.',
        items: [
            { inventoryItemId: '3', name: 'Tente', quantity: 1, condition: 'Usé' },
        ],
    },
];

export default function ReservationDetails({ booking_id, mode }: ReservationDetailsProps) {
    const { token } = useAuth();
    const { mapReservation } = useApp()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [lastInventory, setLastInventory] = useState<InventorySummary | null>(null);
    const [invOpen, setInvOpen] = useState(false);
    const [invType, setInvType] = useState<'arrivee' | 'depart'>('arrivee');

    const router = useRouter();
    const pathname = usePathname();

    // console.log("reservation", reservation)

    const goToInventory = (type: 'arrivee' | 'depart') => {
        router.push(
            `/admin/inventory-form?reservation_id=${currentBooking?.booking_id}&rental_id=${currentBooking?.campsite_id}&type=${type}`
        );
    };

    // Back button in admin, not in client
    const showBackButton = mode === "admin";

    // const lastInventory = mockInventories.find(
    //     (inv) => inv.id === currentBooking?.lastInventoryId
    // );
    const start = currentBooking?.startDate ? parseISO(currentBooking.startDate) : null;
    const end = currentBooking?.endDate ? parseISO(currentBooking.endDate) : null;

    const fetchInventoryById = async (inventoryId: string) => {
        try {
            const res = await fetch(`/api/inventories/${inventoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) {
                setLastInventory(null)
                return null;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const inv = await res.json();
            console.log("data", inv);

            const normType: 0 | 1 = inv.type === 'arrival' ? 0 : 1;
            const items: InventoryItemUI[] = Array.isArray(inv.inventory_items)
                ? inv.inventory_items.map((it: any) => ({
                    inventoryItemId: it.inventory_item_id,
                    name: it.name,
                    quantity: it.quantity,
                    condition: it.condition ?? null,
                }))
                : [];

            const summary: InventorySummary = {
                id: inv.inventory_id,
                type: normType,
                createdAt: inv.created_at,
                comment: inv.comment ?? null,
                items,
            };
            console.log("summary", summary);
            setLastInventory(summary);
            return summary;
        } catch (e: any) {
            console.error(e);
            setError(e.message);
            return null;
        } finally {
            //
        }
    }

    useEffect(() => {
        const fetchBookingById = async () => {
            try {
                if (!token || !booking_id) return;
                console.log("token", token);
                setLoading(true);

                const res = await fetch(`/api/bookings/${booking_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 404) {
                    setCurrentBooking(null);         // affichera “introuvable”
                    return;
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                console.log("data", data);
                const mappedBooking: Booking = mapReservation(data);
                console.log("Mapped data", mappedBooking)
                setCurrentBooking(mappedBooking);

                if (mappedBooking.lastInventoryId) {
                    await fetchInventoryById(mappedBooking.lastInventoryId);
                } else {
                    setLastInventory(null);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        if (mode === 'admin') fetchBookingById();
    }, [token, booking_id, mapReservation]);


    const openInventoryModal = (type: 'arrivee' | 'depart') => {
        setInvType(type);
        setInvOpen(true);
    }

    const handleCreateInventory = async (data: InventoryFormData) => {
        if (!currentBooking) return;
        setError('');

        try {
            const payload = {
                campsite_id: currentBooking.campsite_id,
                booking_id: currentBooking.booking_id, // facultatif côté backend
                type: data.type === 'arrivee' ? 'arrival' : 'departure',
                // comment: éventuellement ajouter un champ commentaire dans la modale si tu veux
                items: data.items.map(it => ({
                    name: it.name,
                    quantity: it.quantity,
                    condition: it.condition,
                })),
            };

            const res = await fetch(`/api/inventories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                // renvoie l’erreur du backend si dispo
                const j = await res.json().catch(() => ({}));
                const msg = j?.error || j?.message || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            const created = await res.json();

            // maj quick UI
            setCurrentBooking(prev => prev ? { ...prev, lastInventoryId: created.inventory_id } : prev);
            await fetchInventoryById(created.inventory_id);
        } catch (e: any) {
            setError(e.message || 'Erreur lors de la création de l’inventaire');
        }
    };

    const renderButtons = () => {
        if (mode === 'admin') {
            if (!lastInventory) {
                return (
                    <button
                        onClick={() => openInventoryModal('arrivee')}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                    >
                        Faire l'état des lieux d'arrivée
                    </button>
                );
            }

            if (lastInventory.type === 0) {
                return (
                    <>
                        <button
                            onClick={() => openInventoryModal('arrivee')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                        >
                            Modifier état des lieux d'arrivée
                        </button>
                        <button
                            onClick={() => openInventoryModal('depart')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                        >
                            Faire l'état des lieux de départ
                        </button>
                    </>
                );
            }

            if (lastInventory.type === 1) {
                return (
                    <button
                        onClick={() => openInventoryModal('depart')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                    >
                        Modifier les inventaires
                    </button>
                );
            }

            return null;
        }
        return null
    };

    if (loading) return <Loader className="h-56" />;

    return (
        <>
            <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 space-y-6">

                {/* Retour */}
                {showBackButton && (
                    <div className="block sm:hidden mb-2">
                        <button
                            onClick={() => router.push('/admin/reservations')}
                            className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium transition"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Retour à la liste
                        </button>
                    </div>
                )}

                <h2 className="text-2xl font-bold text-green-700 text-center">
                    Réservation {currentBooking?.resName}
                </h2>

                {/* Infos réservation */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                        <User2 className="w-5 h-5 text-green-500" />
                        <span>{currentBooking?.resName}</span>
                    </div>
                    {currentBooking?.email && (
                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail className="w-5 h-5 text-green-500" />
                            <span>{currentBooking?.email}</span>
                        </div>
                    )}
                    {currentBooking?.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone className="w-5 h-5 text-green-500" />
                            <span>{currentBooking.phone}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-700">
                        <CalendarDays className="w-5 h-5 text-green-500" />
                        <span>
                            {start && isValid(start) ? format(start, 'dd MMM yyyy', { locale: fr }) : '—'} →{' '}
                            {end && isValid(end) ? format(end, 'dd MMM yyyy', { locale: fr }) : '—'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        🛏️ <span>Hébergement : <strong>{currentBooking?.campsiteName}</strong></span>
                    </div>
                </div>

                {/* Résumé inventaire */}
                {lastInventory && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <ClipboardList className="w-5 h-5 text-green-600" />
                            <span>Résumé de l'inventaire</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {lastInventory.items.map((item) => (
                                <div
                                    key={item.inventoryItemId}
                                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                                >
                                    <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                                    <div className="text-sm text-gray-500 mt-1">
                                        <span className="block">Quantité : <span className="font-medium text-gray-700">{item.quantity}</span></span>
                                        <span className="block">État : <span className="font-medium text-gray-700">{item.condition}</span></span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                            <strong className="block text-gray-800 mb-1">Commentaire de l'état des lieux</strong>
                            {lastInventory.comment}
                        </div>
                    </div>
                )}


                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    {renderButtons()}
                </div>
            </div>
            <InventoryFormModal
                isOpen={invOpen}
                onClose={() => setInvOpen(false)}
                type={invType}
                onSubmit={handleCreateInventory}
            />
        </>
    );
}