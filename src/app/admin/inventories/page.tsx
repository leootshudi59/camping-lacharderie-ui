import type { Metadata } from 'next';
import InventoryList from '@/components/inventories/InventoryList';

export const metadata: Metadata = {
  title: 'Inventaires',
  robots: { index: false, follow: false },
  alternates: { canonical: '/admin/inventories' },
};

export default function InventoriesPage() {
  return (
    <div className="space-y-6">
      <InventoryList />
    </div>
  );
}