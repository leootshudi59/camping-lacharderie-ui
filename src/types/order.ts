export type OrderStatus = 'received' | 'delivered' | 'cancelled' | 'paid';

export type OrderItem = {
  order_item_id: string;
  product_id: string;
  quantity: number;
  products: {
    product_id: string;
    name: string;
    price: number;
    image: string;
  };
};

export type Order = {
  order_id: string;
  reservation_id?: string;
  booking_name?: string;          // pour affichage rapide
  created_at: string;         // ISO
  status: OrderStatus;
  order_items: OrderItem[];
};