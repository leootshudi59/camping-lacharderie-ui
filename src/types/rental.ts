// src/types/rental.ts

export type Reservation = {
    reservation_id: string;
    res_name: string;
    start_date: string;
    end_date: string;
    email?: string;
    phone?: string;
};

export type Rental = {
    campsite_id: string;
    name: string;
    type: string;
    description: string;
    status: 'Disponible' | 'Occupé' | 'Problème';
    image?: string;
    current_reservation?: Reservation;
};  