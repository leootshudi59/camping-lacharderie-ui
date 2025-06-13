// src/mocks/mockRentals.ts

import { Rental } from '@/types/rental';

export const mockRentals: Rental[] = [
  {
    rental_id: '1',
    name: 'Mobil-home 5',
    type: 'Mobil-home',
    description: 'Mobil-home récent, 4 couchages, terrasse couverte.',
    status: 'disponible',
    image: 'https://source.unsplash.com/400x300/?mobilhome',
  },
  {
    rental_id: '2',
    name: 'Tente 3A',
    type: 'Tente',
    description: 'Grande tente familiale proche des sanitaires.',
    status: 'occupé',
    image: 'https://source.unsplash.com/400x300/?tent',
    current_reservation: {
      reservation_id: '1',
      res_name: 'Famille Dupont',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      email: 'dupont@example.com',
      phone: '+33 6 12 34 56 78',
    },
  },
  {
    rental_id: '3',
    name: 'Cabane 8',
    type: 'Cabane',
    description: 'Cabane bois 2 chambres, isolée.',
    status: 'problème',
    image: 'https://source.unsplash.com/400x300/?cabin',
  },
  {
    rental_id: '4',
    name: 'Mobil-Home 17',
    type: 'Mobil-home',
    description: 'Mobil-home récent, 2 couchages, terrasse couverte.',
    status: 'disponible',
    image: 'https://source.unsplash.com/400x300/?mobilhome',
  },
];