import ReservationDetails from '@/components/reservations/ReservationDetails';
import { notFound } from 'next/navigation';

type Reservation = {
    id: string;
    resName: string;
    rentalId: string;
    rentalName: string;
    startDate: string;
    endDate: string;
    email: string;
    phone: string;
    lastInventoryId?: string;
};

const mockReservations: Reservation[] = [
    {
        id: '1',
        resName: 'Famille Dupont',
        rentalId: '4',
        rentalName: 'Mobil-Home 17',
        startDate: '2025-07-10',
        endDate: '2025-07-17',
        email: 'dupont@example.com',
        phone: '+33612345678',
        lastInventoryId: '1',
    },
    {
        id: '2',
        resName: 'Groupe Martin',
        rentalId: '1',
        rentalName: 'Tente 3A',
        startDate: '2025-07-12',
        endDate: '2025-07-19',
        email: 'martin@example.com',
        phone: '+33687654321',
        lastInventoryId: '3',
    },
    {
        id: '3',
        resName: 'Solo Legrand',
        rentalId: '8',
        rentalName: 'Cabane 8',
        startDate: '2025-07-15',
        endDate: '2025-07-22',
        email: 'legrand@example.com',
        phone: '+33699999999',
    },
];

export default function ReservationPage({ params }: { params: { id: string } }) {
    const reservation = mockReservations.find(r => r.id === params.id);

    if (!reservation) return notFound();

    return (
        <div className="max-w-3xl mx-auto">
            <ReservationDetails reservation={reservation} />
        </div>
    );
}