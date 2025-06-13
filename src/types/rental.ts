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
    rental_id: string;
    name: string;
    type: string;
    description: string;
    status: 'disponible' | 'occupé' | 'problème';
    image?: string;
    current_reservation?: Reservation;
};  