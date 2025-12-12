'use client';

import ReservationDetails from '@/components/reservations/ReservationDetails';
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';
import { mockReservations } from '@/mocks/mockReservations';

export default function ClientReservationPage() {
    // On récupère les infos user depuis le localStorage
    if (typeof window === "undefined") return null;

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('reservationUser') || '');
    } catch { }

    // Pour le mock, on retrouve la réservation
    const reservation = mockReservations.find(
        (r) =>
            r.resName.toLowerCase() === user?.name?.toLowerCase() &&
            r.booking_id === user?.reservationNumber
    );

    // Si rien, on gère l’erreur/404 (améliore si besoin)
    if (!reservation) return (<div className="p-8 text-center">Réservation introuvable.</div>);

    return (
        <ClientAuthGuard>
            <div className="py-6">
                <ReservationDetails reservation={reservation} mode="client" />
            </div>
        </ClientAuthGuard>
    );
}