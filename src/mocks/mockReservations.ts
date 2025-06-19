import { Reservation } from '@/types/reservation';

export const mockReservations: Reservation[] = [
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
