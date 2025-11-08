'use client';

import { CalendarDays, Mail, Phone, User2, ArrowLeft, ClipboardList, Pencil } from 'lucide-react';
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
    mode?: 'admin' | 'client' | 'clientGuest';
};

export default function ReservationDetails({ booking_id, mode }: ReservationDetailsProps) {
    const { token, guestToken } = useAuth();
    const { mapReservation } = useApp()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [lastInventory, setLastInventory] = useState<InventorySummary | null>(null);
    const [inventories, setInventories] = useState<InventorySummary[]>([]);
    const [invOpen, setInvOpen] = useState(false);
    const [invType, setInvType] = useState<'arrivee' | 'depart'>('arrivee');

    const router = useRouter();
    const pathname = usePathname();

    // Back button in admin, not in client
    const showBackButton = mode === "admin";

    // const lastInventory = mockInventories.find(
    //     (inv) => inv.id === currentBooking?.lastInventoryId
    // );
    const start = currentBooking?.startDate ? parseISO(currentBooking.startDate) : null;
    const end = currentBooking?.endDate ? parseISO(currentBooking.endDate) : null;

    const fetchInventoryById = async (inventoryId: string) => {
        try {
            const isGuest = mode === 'clientGuest';
            console.log("is Guest?", isGuest);

            const authHeader = isGuest
                ? { Authorization: `Bearer ${guestToken}` }
                : { Authorization: `Bearer ${token}` };

            const url = isGuest
                ? `/api/guest/bookings/${booking_id}/inventories/${inventoryId}`
                : `/api/inventories/${inventoryId}`;

            const res = await fetch(url, {
                headers: authHeader,
            });

            if (res.status === 404) {
                setLastInventory(null)
                return null;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const inv = await res.json();
            console.log("One inventory data", inv);

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

    const fetchAllInventoriesByBookingId = async (bookingId: string) => {
        try {
            console.log('fetchAllInventoriesByBookingId')
            if (!token || !bookingId) return;
            console.log("token", token);
            setLoading(true);

            const res = await fetch(`/api/inventories/${bookingId}/inventories`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) {
                setInventories([]);
                return [];
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            console.log("All inventories data", data)
            const mapped: InventorySummary[] = Array.isArray(data)
                ? data.map((inv: any) => ({
                    id: inv.inventory_id,
                    type: inv.type === 'arrival' ? 0 : 1,
                    createdAt: inv.created_at,
                    comment: inv.comment ?? null,
                    items: Array.isArray(inv.inventory_items)
                        ? inv.inventory_items.map((it: any) => ({
                            inventoryItemId: it.inventory_item_id,
                            name: it.name,
                            quantity: it.quantity,
                            condition: it.condition ?? null,
                        }))
                        : [],
                }))
                : [];
            setInventories(mapped);
            return mapped;
        } catch (e: any) {
            console.log('error ouai ouai')
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchBookingById = async () => {
        try {
            console.log('fetchBookingById')
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
                const allInvs = await fetchAllInventoriesByBookingId(booking_id);
                console.log("All inventories", allInvs)
                await fetchInventoryById(mappedBooking.lastInventoryId);
            } else {
                setLastInventory(null);
            }
        } catch (e: any) {
            console.log('error ouai ouai')
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }
    const fetchGuestBookingById = async () => {
        console.log('fetchGuestBookingById')

        try {
            if (!guestToken || !booking_id) return;
            console.log("token", guestToken);
            setLoading(true);

            const res = await fetch(`/api/guest/bookings/${booking_id}`, {
                headers: { Authorization: `Bearer ${guestToken}` },
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
            console.log('error ouai ouai')
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (mode === 'admin') fetchBookingById();
        if (mode === 'clientGuest') fetchGuestBookingById();
    }, [token, guestToken, booking_id, mapReservation]);


    const openInventoryModal = (type: 'arrivee' | 'depart') => {
        setInvType(type);
        setInvOpen(true);
    }

    const handleCreateInventory = async (data: InventoryFormData) => {
        if (!currentBooking) return;
        setError('');

        try {
            const isGuest = mode === 'clientGuest';
            const authHeader = isGuest ? { Authorization: `Bearer ${guestToken}` } : { Authorization: `Bearer ${token}` };

            const url = isGuest
                ? `/api/guest/bookings/${currentBooking.booking_id}/inventories`
                : `/api/inventories`;

            const payload = isGuest
                ? {
                    // booking_id injecté via l'URL, ignorer côté body
                    type: data.type === 'arrivee' ? 'arrival' : 'departure',
                    comment: undefined, // ou data.comment si tu ajoutes ce champ dans la modal
                    items: data.items.map(it => ({
                        name: it.name,
                        quantity: it.quantity,
                        condition: it.condition,
                    })),
                }
                : {
                    campsite_id: currentBooking.campsite_id,
                    booking_id: currentBooking.booking_id,
                    type: data.type === 'arrivee' ? 'arrival' : 'departure',
                    items: data.items.map(it => ({
                        name: it.name,
                        quantity: it.quantity,
                        condition: it.condition,
                    })),
                };

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                // sends the error message from the backend if available
                const j = await res.json().catch(() => ({}));
                const msg = j?.error || j?.message || `HTTP ${res.status}`;
                throw new Error(msg);
            }

            const created = await res.json();

            // maj quick UI
            setCurrentBooking(prev => prev ? { ...prev, lastInventoryId: created.inventory_id } : prev);
            await fetchInventoryById(created.inventory_id);
        } catch (e: any) {
            setError(e.message || 'Erreur lors de la création de l\'inventaire');
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
        if (mode === 'clientGuest') {
            // The camper can ONLY make the ARRIVAL inventory, and ONLY if there is none yet
            if (!lastInventory) {
                return (
                    <button
                        onClick={() => openInventoryModal('arrivee')}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                    >
                        Remplir l'état des lieux d'arrivée
                    </button>
                );
            }
            return null;
        };
        return null;
    }

    if (loading) return <Loader className="h-56" />;

    return (
        <>
            <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 space-y-6">

                {/* Retour */}
                {showBackButton && (
                    <div className="block sm:hidden mb-2">
                        <button
                            onClick={() => router.push('/admin/bookings')}
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
                {mode !== 'admin' && lastInventory && (
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

                {/* Liste complète des inventaires (admin) */}
                {mode === 'admin' && inventories.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <ClipboardList className="w-5 h-5 text-green-600" />
                            <span>Inventaires de cette réservation</span>
                        </div>

                        <div className="space-y-3">
                            {[...inventories]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((inv) => (
                                    <div
                                        key={inv.id}
                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        {/* En-tête carte */}
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="text-sm text-gray-700">
                                                <span className="font-medium">{inv.type === 0 ? 'Arrivée' : 'Départ'}</span>
                                                {' · '}
                                                {isValid(parseISO(inv.createdAt))
                                                    ? format(parseISO(inv.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })
                                                    : '—'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    {inv.items.length} élément{inv.items.length > 1 ? 's' : ''}
                                                </div>

                                                {/* Bouton Modifier (admin only) */}
                                                {mode === 'admin' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditInventory(inv)}
                                                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition font-medium"
                                                        aria-label="Modifier l'inventaire"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        Corriger
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Commentaire si présent */}
                                        {inv.comment && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <span className="font-medium">Commentaire : </span>
                                                {inv.comment}
                                            </div>
                                        )}

                                        {/* Items */}
                                        {/* {inv.items.length > 0 && (
                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {inv.items.map((it) => (
                                                    <div key={it.inventoryItemId} className="rounded-md border border-gray-200 p-3">
                                                        <div className="text-sm font-semibold text-gray-800">{it.name}</div>
                                                        <div className="mt-1 text-xs text-gray-600">
                                                            Qté : <span className="font-medium">{it.quantity}</span>{' '}
                                                            · État : <span className="font-medium">{it.condition ?? '—'}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )} */}
                                        {inv.items.length > 0 ? (
                                            <div className="mt-3 overflow-x-auto">
                                                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                                    <thead className="bg-gray-50 text-gray-700">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left w-1/2">Élément</th>
                                                            <th className="px-3 py-2 text-right w-24">Quantité</th>
                                                            <th className="px-3 py-2 text-left w-1/3">État</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {inv.items.map((it) => (
                                                            <tr key={it.inventoryItemId} className="hover:bg-gray-50">
                                                                <td className="px-3 py-2 text-gray-800 font-medium">
                                                                    {it.name}
                                                                </td>
                                                                <td className="px-3 py-2 text-right text-gray-700">
                                                                    {it.quantity}
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-700">
                                                                    {it.condition ?? '—'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="mt-3 text-sm text-gray-600 italic">
                                                Aucun élément renseigné pour cet inventaire.
                                            </div>
                                        )}
                                    </div>
                                ))}
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