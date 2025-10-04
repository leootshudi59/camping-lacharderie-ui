'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Booking } from '@/types/reservation';

type Campsite = { campsite_id: string; name: string; type?: string };

type AppState = {
    reservations: Booking[];
    campsites: Campsite[];
}

type AppActions = {
    // fetchReservations: () => Promise<void>;
    // fetchCampsites: () => Promise<void>;
    setReservations: React.Dispatch<React.SetStateAction<Booking[]>>;
    setCampsites: React.Dispatch<React.SetStateAction<Campsite[]>>;
    mapReservation: (apiRes: any) => Booking; // ✅ fonction
};

type AppCtx = AppState & AppActions;


const AppContext = createContext<AppCtx | null>(null);
export const useApp = () => useContext(AppContext)!;

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [reservations, setReservations] = useState<Booking[]>([]);
    const [campsites, setCampsites] = useState<Campsite[]>([]);

    /**
     * Maps a booking from the API to a Reservation object
     * @param apiRes Booking from the API
     * @returns Reservation object
     */
    function mapReservation(apiRes: any): Booking {
        console.log("Mapping reservation", apiRes.booking_id)
        const formatDate = (iso: string) =>
            iso ? new Date(iso).toLocaleDateString('fr-FR') : '';

        return {
            booking_id: apiRes.booking_id,
            resName: apiRes.res_name,
            campsite_id: apiRes.campsite_id,
            campsiteName: apiRes.campsite_name,
            startDate: String(apiRes.start_date ?? ''),
            endDate: String(apiRes.end_date ?? ''),
            email: apiRes.email || 'non renseigné',
            phone: apiRes.phone || 'non renseigné',
            lastInventoryId: apiRes.inventory_id || undefined,
        };
    }

    return (
        <AppContext.Provider
            value={{
                reservations, setReservations, campsites, setCampsites, mapReservation
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
