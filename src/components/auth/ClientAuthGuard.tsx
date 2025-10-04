'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default function ClientAuthGuard({ children }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Vérifie la présence d'un "utilisateur" dans le localStorage
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('reservationUser');
      if (!user) {
        router.replace('/login');
      } else {
        setChecked(true);
      }
    }
  }, [router]);

  // Empêche le flash du contenu avant la vérif
  if (!checked) {
    return null; // Ou un loader/spinner si tu veux
  }

  return <>{children}</>;
}