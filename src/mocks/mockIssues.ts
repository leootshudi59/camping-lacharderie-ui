// /mocks/mockIssues.ts

import { Issue } from '@/types/issue';

export const mockIssues: Issue[] = [
  {
    issue_id: 'issue-1',
    title: 'Fuite sous l’évier',
    description: 'De l’eau coule lentement sous l’évier de la cuisine.',
    status: 'open',
    created_at: '2025-06-15T09:30:00',
    rental_name: 'Mobil-home 5',
    res_name: 'Dupont',
  },
  {
    issue_id: 'issue-2',
    title: 'Ampoule grillée dans la chambre',
    description: 'La lampe principale ne s’allume plus.',
    status: 'in_progress',
    created_at: '2025-06-14T17:10:00',
    rental_name: 'Cabane 8',
    res_name: 'Martin',
  },
  {
    issue_id: 'issue-3',
    title: 'Porte d’entrée qui frotte',
    description: 'Difficile à fermer, surtout le soir.',
    status: 'resolved',
    created_at: '2025-06-12T08:45:00',
    rental_name: 'Tente 3A',
    res_name: 'Lemoine',
  },
];