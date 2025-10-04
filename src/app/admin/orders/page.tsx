'use client';

import OrderList from '@/components/orders/OrderList';

export default function OrdersPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8">
      <OrderList />
    </div>
  );
}