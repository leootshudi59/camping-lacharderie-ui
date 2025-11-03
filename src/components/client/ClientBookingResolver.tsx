'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ReservationDetails from '@/components/reservations/ReservationDetails';

export default function ClientBookingResolver({ id }: { id: string }) {
  const { token, guestToken, isAdmin } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // wait for local restore, then gate
    const has =
      token ||
      guestToken ||
      (typeof window !== 'undefined' && (localStorage.getItem('jwt') || localStorage.getItem('guest_jwt')));
    if (!has) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [token, guestToken, router]);

  if (!ready) return null;

  const mode: 'admin' | 'client' | 'clientGuest' =
    guestToken ? 'clientGuest' : isAdmin ? 'admin' : 'client';

  return <ReservationDetails booking_id={id} mode={mode} />;
}