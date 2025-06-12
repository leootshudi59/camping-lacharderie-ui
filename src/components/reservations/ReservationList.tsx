'use client';

import { useState } from 'react';
import { Calendar, Mail, Phone, Search, SlidersHorizontal, X } from 'lucide-react';

type Reservation = {
  id: string;
  resName: string;
  rentalName: string;
  startDate: string; // format YYYY-MM-DD
  endDate: string;
  email: string;
  phone: string;
};

const mockReservations: Reservation[] = [
  {
    id: '1',
    resName: 'Famille Dupont',
    rentalName: 'Mobil-Home 17',
    startDate: '2025-07-10',
    endDate: '2025-07-17',
    email: 'dupont@example.com',
    phone: '+33612345678',
  },
  {
    id: '2',
    resName: 'Groupe Martin',
    rentalName: 'Tente 3A',
    startDate: '2025-07-12',
    endDate: '2025-07-19',
    email: 'martin@example.com',
    phone: '+33687654321',
  },
  {
    id: '3',
    resName: 'Solo Legrand',
    rentalName: 'Cabane 8',
    startDate: '2025-07-15',
    endDate: '2025-07-22',
    email: 'legrand@example.com',
    phone: '+33699999999',
  },
];

function isDateInRange(
  res: Reservation,
  startFilter: string,
  endFilter: string
): boolean {
  const resStart = new Date(res.startDate);
  const resEnd = new Date(res.endDate);

  if (startFilter && new Date(startFilter) > resEnd) return false;
  if (endFilter && new Date(endFilter) < resStart) return false;
  return true;
}

export default function ReservationList() {
  const [search, setSearch] = useState('');
  const [startFilter, setStartFilter] = useState('');
  const [endFilter, setEndFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = mockReservations.filter((res) => {
    const matchText =
      res.resName.toLowerCase().includes(search.toLowerCase()) ||
      res.rentalName.toLowerCase().includes(search.toLowerCase());

    const matchDate = isDateInRange(res, startFilter, endFilter);

    return matchText && matchDate;
  });

  return (
    <div>
      {/* Filtres - mobile : bouton, desktop : affiché */}
      <div className="sm:hidden mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 transition"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filtres
        </button>
        {/* Drawer/Modal de filtres */}
        {filtersOpen && (
          <div className="fixed inset-0 z-40 flex justify-center items-end bg-black/40">
            <div className="bg-white w-full rounded-t-2xl p-6 max-w-md shadow-lg animate-slideup">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Filtres</span>
                <button
                  className="text-gray-400 hover:text-gray-700"
                  onClick={() => setFiltersOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Recherche</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Nom réservation ou logement"
                      className="pl-8 pr-3 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Début après</label>
                  <input
                    type="date"
                    value={startFilter}
                    onChange={e => setStartFilter(e.target.value)}
                    className="py-2 px-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fin avant</label>
                  <input
                    type="date"
                    value={endFilter}
                    onChange={e => setEndFilter(e.target.value)}
                    className="py-2 px-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
              <button
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={() => setFiltersOpen(false)}
              >
                Voir les résultats
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filtres desktop : toujours visibles */}
      <div className="hidden sm:flex flex-row gap-3 mb-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Recherche</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Nom réservation ou logement"
              className="pl-8 pr-3 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Début après</label>
          <input
            type="date"
            value={startFilter}
            onChange={e => setStartFilter(e.target.value)}
            className="py-2 px-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fin avant</label>
          <input
            type="date"
            value={endFilter}
            onChange={e => setEndFilter(e.target.value)}
            className="py-2 px-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
      </div>

      {/* Liste filtrée */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">Aucune réservation trouvée.</div>
        ) : (
          filtered.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition flex flex-col"
            >
              <h3 className="text-lg font-semibold text-green-700 mb-1">{res.resName}</h3>
              <p className="text-sm text-gray-600 mb-2">{res.rentalName}</p>
              <div className="flex items-center text-sm text-gray-500 gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                {res.startDate} → {res.endDate}
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-2 mb-1">
                <Mail className="w-4 h-4" />
                {res.email}
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-2 mb-3">
                <Phone className="w-4 h-4" />
                {res.phone}
              </div>
              <button className="mt-auto px-4 py-2 rounded-md text-sm bg-green-600 text-white hover:bg-green-700 transition w-full">
                Voir l’état des lieux
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}