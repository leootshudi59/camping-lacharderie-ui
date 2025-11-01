'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ShoppingCart, AlertTriangle, MapPinned } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type ReservationCard = {
  name: string;
  bookingNumber: string;
  rentalName: string;
  endDate: string; // affichage FR
};

const mapToCard = (b: any): ReservationCard => ({
  name: b?.res_name ?? b?.resName ?? '',
  bookingNumber: b?.booking_number ?? b?.bookingNumber ?? '',
  rentalName: b?.campsite_name ?? b?.campsiteName ?? '',
  endDate: b?.end_date
    ? new Date(b.end_date).toLocaleDateString('fr-FR')
    : (b?.endDate ?? ''),
});

export default function ClientHome() {
  const { guestToken, guestBooking, logoutGuest } = useAuth();
  const [card, setCard] = useState<ReservationCard | null>(
    guestBooking ? mapToCard(guestBooking) : null
  );

  useEffect(() => {
    (async () => {
      if (!guestToken) return;

      // 1) Si on a déjà le booking en mémoire (AuthContext) → on mappe
      if (guestBooking) {
        console.log("found guest booking in localStorage", guestBooking);
        setCard(mapToCard(guestBooking));
        return;
      }

      // 2) Fallback (rare) : relecture locale + refetch API
      try {
        const raw = localStorage.getItem('guest_booking');
        const gb = raw ? JSON.parse(raw) : null;
        const id = gb?.booking_id;
        if (!id) return;

        const r = await fetch(`/api/guest/bookings/${id}`, {
          headers: { Authorization: `Bearer ${guestToken}` },
        });
        if (r.status === 401) { logoutGuest(); return; }
        const j = await r.json();
        console.log("guest booking from API", j);
        if (!r.ok) throw new Error(j?.error || 'Erreur');
        setCard(mapToCard(j));
      } catch {
        // no-op (tu peux ajouter un toast ici si tu veux)
      }
    })();
  }, [guestToken, guestBooking, logoutGuest]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header / Logo */}
      <header className="flex flex-col items-center justify-center py-10 px-4">
        <img
          src="/logo-camping.svg"
          alt="Logo Camping"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-2 tracking-tight text-center">
          Bienvenue au Camping La Charderie
        </h1>
        <p className="text-gray-600 text-lg text-center">
          Profitez de votre séjour et gérez tout facilement ici !
        </p>
      </header>

      {/* Résa */}
      {card && (
        <section className="w-full max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="text-gray-800 font-bold text-lg">{card.name}</div>
              <div className="text-gray-600 text-sm">
                <span className="font-medium">Nº réservation :</span> {card.bookingNumber}
              </div>
              <div className="text-gray-600 text-sm">
                <span className="font-medium">Emplacement :</span> {card.rentalName}
              </div>
              <div className="text-gray-600 text-sm">
                <span className="font-medium">Fin du séjour :</span> {card.endDate}
              </div>
            </div>
            <Link
              href={`/bookings/${card.bookingNumber}`} // tu gèreras le détail derrière
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition"
            >
              Voir ma réservation
            </Link>
          </div>
        </section>
      )}

      {/* Accès rapides */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/inventory" className="group rounded-2xl bg-white shadow-md p-6 flex items-center transition hover:bg-green-50 hover:shadow-lg">
            <AlertTriangle className="w-8 h-8 text-green-500 mr-4 group-hover:scale-110 transition" />
            <div>
              <span className="text-lg font-semibold text-gray-800">État des lieux</span>
              <p className="text-gray-500 text-sm">Remplir votre inventaire d'arrivée</p>
            </div>
          </Link>
          <Link href="/bread-order" className="group rounded-2xl bg-white shadow-md p-6 flex items-center transition hover:bg-green-50 hover:shadow-lg">
            <ShoppingCart className="w-8 h-8 text-green-500 mr-4 group-hover:scale-110 transition" />
            <div>
              <span className="text-lg font-semibold text-gray-800">Commandes</span>
              <p className="text-gray-500 text-sm">Commander du pain, ou autres produits pour petit déjeuner</p>
            </div>
          </Link>
          <Link href="/events" className="group rounded-2xl bg-white shadow-md p-6 flex items-center transition hover:bg-green-50 hover:shadow-lg">
            <CalendarDays className="w-8 h-8 text-green-500 mr-4 group-hover:scale-110 transition" />
            <div>
              <span className="text-lg font-semibold text-gray-800">Événements</span>
              <p className="text-gray-500 text-sm">Découvrir les animations du camping</p>
            </div>
          </Link>
          <Link href="/map" className="group rounded-2xl bg-white shadow-md p-6 flex items-center transition hover:bg-green-50 hover:shadow-lg">
            <MapPinned className="w-8 h-8 text-green-500 mr-4 group-hover:scale-110 transition" />
            <div>
              <span className="text-lg font-semibold text-gray-800">Carte du camping</span>
              <p className="text-gray-500 text-sm">Se repérer facilement sur place</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} La Charderie — Application réalisée par Léo Otshudi.
      </footer>
    </div>
  );
}