import { Booking } from '@/types/reservation';

export const mockReservations: Booking[] = [
    {
        booking_id: '12345',
        resName: 'Dupont',
        campsite_id: '4',
        campsiteName: '15',
        startDate: '2025-07-10',
        endDate: '2025-07-17',
        email: 'dupont@example.com',
        phone: '+33612345678',
        lastInventoryId: '1',
    },
    {
        booking_id: '23456',
        resName: 'Groupe Martin',
        campsite_id: '2',
        campsiteName: 'Tente 3A',
        startDate: '2025-07-12',
        endDate: '2025-07-19',
        email: 'martin@example.com',
        phone: '+33687654321',
        lastInventoryId: '3',
    },
    {
        booking_id: '34567',
        resName: 'Solo Legrand',
        campsite_id: '3',
        campsiteName: 'Cabane 8',
        startDate: '2025-07-15',
        endDate: '2025-07-22',
        email: 'legrand@example.com',
        phone: '+33699999999',
    },
];
