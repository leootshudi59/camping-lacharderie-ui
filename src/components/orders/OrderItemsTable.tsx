'use client';

import { OrderItem } from '@/types/order';

type Props = {
  items: OrderItem[];
};

export default function OrderItemsTable({ items }: Props) {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-green-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Produit</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Quantité</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.order_item_id} className="hover:bg-green-50">
              <td className="px-4 py-2">{item.product_name}</td>
              <td className="px-4 py-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}