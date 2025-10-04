export type OrderStatus = 'received' | 'delivered' | 'cancelled' | 'paid';

export type OrderItem = {
  order_item_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
};

export type Order = {
  order_id: string;
  reservation_id?: string;
  res_name?: string;          // pour affichage rapide
  created_at: string;         // ISO
  status: OrderStatus;
  items: OrderItem[];
};