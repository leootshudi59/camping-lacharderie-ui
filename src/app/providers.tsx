// src/app/Providers.tsx
'use client';
import { AuthProvider } from '@/context/AuthContext';
import { InventoriesProvider } from '@/context/AppContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InventoriesProvider>
        {children}
      </InventoriesProvider>
    </AuthProvider>
  );
}
