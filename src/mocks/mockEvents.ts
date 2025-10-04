// /mocks/mockEvents.ts

export type Event = {
    event_id: string;
    title: string;
    description?: string;
    start_date: string; // format ISO
    end_date: string;   // format ISO
    location?: string;
};

export const mockEvents: Event[] = [
    {
        event_id: 'evt-1',
        title: 'Soirée barbecue',
        description: 'Venez profiter d’une soirée conviviale autour du feu de camp !',
        start_date: '2025-07-08T19:00:00',
        end_date: '2025-07-08T22:00:00',
        location: 'Espace commun',
    },
    {
        event_id: 'evt-2',
        title: 'Tournoi de pétanque',
        description: 'Inscription sur place à partir de 14h.',
        start_date: '2025-07-10T15:00:00',
        end_date: '2025-07-10T18:00:00',
        location: 'Terrain de pétanque',
    },
    {
        event_id: 'evt-3',
        title: 'Atelier enfants : fabrication de cabanes',
        description: 'Pour les 5-12 ans, matériel fourni.',
        start_date: '2025-07-09T10:00:00',
        end_date: '2025-07-09T12:00:00',
        location: 'Aire de jeux',
    },
];