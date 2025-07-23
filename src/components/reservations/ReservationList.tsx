'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Mail, Phone, PlusCircle, Search, SlidersHorizontal, X } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { useAuth } from '@/context/AuthContext';

type Booking = {
  booking_id: string;
  res_name: string;
  campsite_name: string;
  startDate: string; // format YYYY-MM-DD
  endDate: string;
  email: string;
  phone: string;
  lastInventoryId?: string;
};

function isDateInRange(
  res: Booking,
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
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);


  const [search, setSearch] = useState('');
  const [startFilter, setStartFilter] = useState('');
  const [endFilter, setEndFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setReservations(mockReservations);  // on met les données
  //     setLoading(false);                  // on arrête le loader
  //   }, 600);                              // 0,6 s pour l’exemple
  //   return () => clearTimeout(timer);
  // }, []);  
  
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!token) return;
        console.log("token", token);
        setLoading(true);

        const res = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("data", data);
        const mapped = Array.isArray(data)
          ? data.map(mapReservation)
          : [];
        setReservations(mapped);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReservations();
  }, [token]);

  /**
   * Maps a booking from the API to a Reservation object
   * @param apiRes Booking from the API
   * @returns Reservation object
   */
  function mapReservation(apiRes: any): Booking {
    const formatDate = (iso: string) =>
      iso ? new Date(iso).toLocaleDateString('fr-FR') : '';
  
    return {
      booking_id: apiRes.booking_id,
      res_name: apiRes.res_name,
      campsite_name: apiRes.campsite_name,
      startDate: formatDate(apiRes.start_date),
      endDate: formatDate(apiRes.end_date),
      email: apiRes.email || 'non renseigné',
      phone: apiRes.phone || 'non renseigné',
      lastInventoryId: apiRes.inventory_id || undefined,
    };
  }

  const filtered = reservations.filter((res) => {
    const matchText =
      res.res_name.toLowerCase().includes(search.toLowerCase()) ||
      res.campsite_name.toLowerCase().includes(search.toLowerCase());

    const matchDate = isDateInRange(res, startFilter, endFilter);

    return matchText && matchDate;
  });

  if (loading) {
    return <Loader size={12} className="py-20" />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
      <h1 className="text-2xl font-bold text-gray-800">Réservations en cours</h1>
      <button
        onClick={() => setAddModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
      >
        + Ajouter une réservation
      </button>
      </div>
        
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
            <Link
              key={res.booking_id}
              href={`/admin/reservations/${res.booking_id}`}
              className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition flex flex-col"
            >
              <h3 className="text-lg font-semibold text-green-700 mb-1">{res.res_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{res.campsite_name}</p>
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
              <div className="mt-auto px-4 py-2 rounded-md text-sm bg-green-600 text-white text-center">
                Voir la fiche
              </div>
            </Link>
          ))
        )}
      </div>
      {/* Filtres - mobile : bouton, desktop : affiché */}
      
    </div>
  );
}