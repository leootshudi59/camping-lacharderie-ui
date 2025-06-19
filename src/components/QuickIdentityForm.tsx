// src/components/QuickIdentityForm.tsx

'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickIdentityForm() {
  const [name, setName] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mock : les paires valides
  const mockValidReservations = [
    { name: 'Dupont', reservationNumber: '12345' },
    { name: 'Martin', reservationNumber: '23456' },
    { name: 'Durand', reservationNumber: '34567' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulation backend : vérif dans le mock
    await new Promise((res) => setTimeout(res, 700));
    const found = mockValidReservations.some(
      (r) =>
        r.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        r.reservationNumber.trim() === reservationNumber.trim()
    );

    setLoading(false);
    if (!found) {
      setError("Nom ou numéro de réservation invalide.");
      return;
    }
    localStorage.setItem(
        'reservationUser',
        JSON.stringify({
          name: name.trim(),
          reservationNumber: reservationNumber.trim()
        })
    );
    // Success, go to accueil campeur
    router.replace('/');
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto space-y-6"
        autoComplete="off"
      >
        <div className="flex flex-col items-center mb-2">
          <img
            src="/logo-camping.svg"
            alt="Logo Camping"
            className="mb-3"
            width={64}
            height={64}
          />
          <h1 className="text-2xl font-bold text-green-700 text-center">
            Bienvenue !
          </h1>
          <p className="text-gray-600 text-center text-sm mt-1">
            Veuillez saisir votre nom <span className="hidden sm:inline">et</span> numéro de réservation pour accéder à vos services.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Nom de réservation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex : Dupont"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Numéro de réservation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reservationNumber}
              required
              onChange={(e) => setReservationNumber(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex : 12345"
              autoComplete="off"
            />
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center mt-2">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-60"
        >
          {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
          Accéder à mon espace campeur
        </button>
      </form>
    );
}