// src/components/QuickIdentityForm.tsx

'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { notifySuccess } from '@/lib/toast';
import FormField from './ui/FormField';

export default function QuickIdentityForm() {
  const [name, setName] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginGuest } = useAuth();

  // Mock : les paires valides
  const mockValidReservations = [
    { name: 'Dupont', reservationNumber: '12345', rentalName: "15", endDate: '2025-07-17' },
    { name: 'Martin', reservationNumber: '23456', rentalName: "Tente 3A", endDate: '2025-07-19' },
    { name: 'Legrand', reservationNumber: '34567', rentalName: "Cabane 8", endDate: '2025-07-22' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // fetchGuestReservation();

    try {
      setLoading(true);
      const res = await fetch('/api/guest/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ res_name: name, booking_number: reservationNumber }),
        credentials: 'include'
      });

      const data = await res.json();
      console.log("guest login response", data);
      
      if (!res.ok) {
        if (data.error === 'Invalid credentials') {
          setError('Nom ou numéro de réservation incorrect');
        }
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      loginGuest(data.token, data.booking);
      notifySuccess('Connexion réussie !');
      // Success, go to accueil campeur
      router.replace('/');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
      <FormField
        label="Nom de réservation"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Ex : Dupont"
        autoComplete="off"
      />

      <FormField
        label="Numéro de réservation"
        type="text"
        value={reservationNumber}
        onChange={(e) => setReservationNumber(e.target.value)}
        required
        placeholder="Ex : 12345"
        autoComplete="off"
      />


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