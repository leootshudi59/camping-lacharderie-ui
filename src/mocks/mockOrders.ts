import { Order } from '@/types/order';

export const mockOrders: Order[] = [
  {
    order_id: 'ord-001',
    reservation_id: '12345',
    booking_name: 'Famille Dupont',
    created_at: new Date().toISOString(),
    status: 'received',
    order_items: [
      { order_item_id: 'oi-1', product_id: 'prod-bread', product_name: 'Baguette', quantity: 4 },
      { order_item_id: 'oi-2', product_id: 'prod-croissant', product_name: 'Croissant', quantity: 6 },
    ],
  },
  {
    order_id: 'ord-002',
    reservation_id: '23456',
    booking_name: 'Groupe Martin',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'delivered',
    order_items: [
      { order_item_id: 'oi-3', product_id: 'prod-bread', product_name: 'Baguette', quantity: 8 },
    ],
  },
  {
    order_id: 'ord-003',
    reservation_id: '12345',
    booking_name: 'Famille Dupont',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'received',
    order_items: [
      { order_item_id: 'oi-1', product_id: 'prod-bread', product_name: 'Baguette', quantity: 2 },
      { order_item_id: 'oi-2', product_id: 'prod-croissant', product_name: 'Croissant', quantity: 1 },
    ],
  },
];