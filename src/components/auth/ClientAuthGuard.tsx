'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Props = { children: React.ReactNode };

export default function ClientAuthGuard({ children }: Props) {
  const router = useRouter();
  const { guestToken } = useAuth();        // ← on s'appuie sur l'invité
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // L’AuthContext restaure en useEffect — on tolère un petit délai
    const gj = typeof window !== 'undefined' ? localStorage.getItem('guest_jwt') : null;

    if (!guestToken && !gj) {
      router.replace('/login');            // page avec QuickIdentityForm
      return;
    }
    setReady(true);
  }, [guestToken, router]);

  if (!ready) return null;                 // ou un spinner
  return <>{children}</>;
}
