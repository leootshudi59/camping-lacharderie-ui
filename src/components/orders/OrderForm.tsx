'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { Product } from '@/types/product';
import { notifyError, notifySuccess } from '@/lib/toast';

type GuestOrderItem = {
  order_item_id: string;
  quantity: number;
  products?: {
    name: string;
  } | null;
};

type GuestOrder = {
  order_id: string;
  created_at: string;
  status: string;
  order_items: GuestOrderItem[];
};

type OrderFormProps = {
  bookingId: string | undefined;
  token: string;
  onClose: () => void;
  onCreated: (order: GuestOrder) => void;
};

type OrderItemInput = {
  product_id: string;
  quantity: number;
};

export default function OrderForm({
  bookingId,
  token,
  onClose,
  onCreated,
}: OrderFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [items, setItems] = useState<OrderItemInput[]>([
    { product_id: '', quantity: 1 },
  ]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération des produits disponibles
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setError(null);

        const r = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await r.json();
        if (!r.ok) {
          throw new Error(data?.error || 'Impossible de charger les produits');
        }
        console.log("Products", data);
        const options: Product[] = (data || []).map((p: any) => ({
          product_id: p.product_id,
          name: p.name,
          price: p.price,
          available: p.available,
        }));

        setProducts(options);

        // Initialises all quantities to 0
        const initialQuantities: Record<string, number> = {};
        options.forEach((p) => {
          initialQuantities[p.product_id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (e: any) {
        setError(e.message);
        notifyError("Impossible de récupérer les produits.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleIncrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  const selectedItems = useMemo(
    () =>
      products
        .map((p) => ({
          product: p,
          quantity: quantities[p.product_id] || 0,
        }))
        .filter((it) => it.quantity > 0),
    [products, quantities]
  );

  const totalQuantity = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.quantity, 0),
    [selectedItems]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const validItems = selectedItems.filter(
      (it) => it.product.product_id && it.quantity && it.quantity > 0
    );

    if (validItems.length === 0) {
      setError('Veuillez ajouter au moins un produit avec une quantité valide.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/guest/bookings/${bookingId}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: validItems.map((it) => ({
            product_id: it.product.product_id,
            quantity: it.quantity,
          })),
        }),
      });

      const created = await res.json();
      if (!res.ok) {
        throw new Error(created?.error || 'Erreur lors de la création de la commande');
      }

      notifySuccess("Commande créée avec succès !");
      onCreated(created as GuestOrder);
    } catch (e: any) {
      setError(e.message);
      notifyError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Nouvelle commande
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {loadingProducts ? (
          <div className="flex justify-center py-6">
            <Loader className="h-12" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-3 py-2 rounded-lg">
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-600">
              Choisissez vos produits et ajustez les quantités avec les boutons ci-dessous.
            </p>

            {/* Grille de produits façon "McDo" */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p) => {
                const qty = quantities[p.product_id] || 0;
                const priceLabel =
                  p.price !== undefined && p.price !== null
                    ? `${Number(p.price).toFixed(2)} €`
                    : '';

                return (
                  <div
                    key={p.product_id}
                    className="flex flex-col items-center bg-white rounded-xl border border-gray-200 shadow-sm px-3 py-4"
                  >
                    {/* "Image" ronde du produit (placeholder / initiale) */}
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
                      <span className="text-sm font-semibold text-green-700 text-center px-1">
                        {p.name.length > 10 ? `${p.name.slice(0, 9)}…` : p.name}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-gray-800 text-center line-clamp-2 mb-1">
                      {p.name}
                    </div>
                    {priceLabel && (
                      <div className="text-xs text-gray-500 mb-2">{priceLabel}</div>
                    )}

                    {/* Boutons quantité */}
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecrement(p.product_id)}
                        disabled={qty === 0}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-gray-800">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(p.product_id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-green-500 hover:bg-green-50 transition"
                      >
                        <Plus className="w-4 h-4 text-green-700" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 px-5 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Annuler
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={selectedItems.length === 0}
            onClick={() => setIsSummaryOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-700 bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span>Résumé de la commande</span>
            {totalQuantity > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-green-600 text-white text-xs px-2 py-0.5">
                {totalQuantity}
              </span>
            )}
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              loadingProducts ||
              products.length === 0 ||
              selectedItems.length === 0
            }
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Envoi en cours…' : 'Valider ma commande'}
          </button>
        </div>
      </div>

      {/* Résumé de la commande */}
      {isSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
            <ul className="space-y-2">
              {selectedItems.map((it) => (
                <li key={it.product.product_id} className="flex items-center justify-between">
                  <span>{it.product.name}</span>
                  <span>{it.quantity} x {it.product.price} €</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <span>Total</span>
              <span>{totalQuantity} x {products[0]?.price} €</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSummaryOpen(false)}
              className="mt-4 w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 transition"
            >
              Valider ma commande
            </button>
          </div>
        </div>
      )}
    </form>
  );
}