import ReservationDetails from '@/components/reservations/ReservationDetails';
import { notFound } from 'next/navigation';
import { mockReservations } from '@/mocks/mockReservations';
import type { Booking } from '@/types/reservation';

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // // const reservation: Reservation | undefined = mockReservations.find(r => r.id === params.id);

    // const res = await fetch('/api/bookings', {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //   });


    // if (!res.ok) {
    //     return notFound();
    // }

    // const reservation: Booking = await res.json();

    // if (!reservation) return notFound();

    return (
        <div className="max-w-3xl mx-auto">
            <ReservationDetails booking_id={id} mode="admin" />
        </div>
    );
}