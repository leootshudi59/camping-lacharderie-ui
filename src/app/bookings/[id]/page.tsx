'use client';

import ReservationDetails from '@/components/reservations/ReservationDetails';
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';
import { mockReservations } from '@/mocks/mockReservations';

export default async function ClientBookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <ClientAuthGuard>
            <div className="py-6">
                <ReservationDetails booking_id={id} mode="client" />
            </div>
        </ClientAuthGuard>
    );
}