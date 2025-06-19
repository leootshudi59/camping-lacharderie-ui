'use client';

import { CalendarDays, Mail, Phone, User2, ArrowLeft, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type ReservationDetailsProps = {
    reservation: {
        id: string;
        resName: string;
        rentalId: string;
        rentalName: string;
        email?: string;
        phone?: string;
        startDate: string;
        endDate: string;
        lastInventoryId?: string;
    };
};

const mockInventories = [
    {
        id: '1',
        reservationId: '1',
        type: 0, // entrée
        createdAt: '2025-07-10',
        comment: 'Inventaire d’arrivée : tout est en bon état.',
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
        comment: 'Inventaire d’arrivée : tout est en bon état.',
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

export default function ReservationDetails({ reservation }: ReservationDetailsProps) {
    const router = useRouter();
    console.log("reservation", reservation)

    const goToInventory = (type: 'arrivee' | 'depart') => {
        router.push(
            `/admin/inventory-form?reservation_id=${reservation.id}&rental_id=${reservation.rentalId}&type=${type}`
        );
    };

    const lastInventory = mockInventories.find(
        (inv) => inv.id === reservation.lastInventoryId
    );

    const renderButtons = () => {
        if (!lastInventory) {
            return (
                <button
                    onClick={() => goToInventory('arrivee')}
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
                        onClick={() => goToInventory('arrivee')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                    >
                        Modifier état des lieux d'arrivée
                    </button>
                    <button
                        onClick={() => goToInventory('depart')}
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
                    onClick={() => goToInventory('depart')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition text-sm font-medium"
                >
                    Modifier les inventaires
                </button>
            );
        }

        return null;
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 space-y-6">

            {/* Retour */}
            <div className="block sm:hidden mb-2">
                <button
                    onClick={() => router.push('/admin/reservations')}
                    className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour à la liste
                </button>
            </div>

            <h2 className="text-2xl font-bold text-green-700 text-center">
                Réservation {reservation.resName}
            </h2>

            {/* Infos réservation */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                    <User2 className="w-5 h-5 text-green-500" />
                    <span>{reservation.resName}</span>
                </div>
                {reservation.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-green-500" />
                        <span>{reservation.email}</span>
                    </div>
                )}
                {reservation.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span>{reservation.phone}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                    <CalendarDays className="w-5 h-5 text-green-500" />
                    <span>
                        {format(new Date(reservation.startDate), 'dd MMM yyyy', { locale: fr })} →{' '}
                        {format(new Date(reservation.endDate), 'dd MMM yyyy', { locale: fr })}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    🛏️ <span>Hébergement : <strong>{reservation.rentalName}</strong></span>
                </div>
            </div>

            {/* Résumé inventaire */}
            {lastInventory && (
                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <ClipboardList className="w-5 h-5 text-green-600" />
                        <span>Résumé de l’inventaire</span>
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
    );
}