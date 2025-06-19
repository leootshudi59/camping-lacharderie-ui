import ReservationDetails from '@/components/reservations/ReservationDetails';
import { notFound } from 'next/navigation';
import { mockReservations } from '@/mocks/mockReservations';
import type { Reservation } from '@/types/reservation';

export default function ReservationPage({ params }: { params: { id: string } }) {
    const reservation: Reservation | undefined = mockReservations.find(r => r.id === params.id);

    if (!reservation) return notFound();

    return (
        <div className="max-w-3xl mx-auto">
            <ReservationDetails reservation={reservation} />
        </div>
    );
}