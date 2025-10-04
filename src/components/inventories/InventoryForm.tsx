'use client';

import { useState, useEffect, useRef } from 'react';
import { X, PlusCircle, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

/* ─────────────── Types ─────────────── */
export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  condition: string;
};

export type InventoryFormData = {
  type: 'arrivee' | 'depart';
  items: InventoryItem[];
};

/* ─────────────── Props ─────────────── */
type InventoryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: InventoryFormData) => void;
  initialItems?: InventoryItem[];
  type: 'arrivee' | 'depart';
};

const CONDITIONS = ['bon', 'abîmé', 'cassé', 'manquant'];

/* ─────────────── Component ─────────────── */
export default function InventoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialItems,
  type,
}: InventoryFormModalProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // accessibilité
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'inventory-dialog-title';

  /* reset à chaque ouverture */
  useEffect(() => {
    if (isOpen) {
      if (initialItems && initialItems.length > 0) {
        setItems(initialItems);
      } else {
        setItems([]);
      }
    }
    // 👇 ici, on écoute uniquement quand la modale s'ouvre ou les items init changent
  }, [isOpen, initialItems]);

  if (!isOpen) return null;

  /* ─────────────── CRUD des items ─────────────── */
  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: (Math.random() + '').slice(2),
        name: '',
        quantity: 1,
        condition: 'bon',
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InventoryItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  /* ─────────────── Submit ─────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data: InventoryFormData = {
        type,
        items,
      };

      onSubmit?.(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── Rendu ─────────────── */
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={dialogRef}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-90 border border-gray-200">

        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-500" aria-hidden="true" focusable="false" />
        </button>

        {/* Titre */}
        <h2 id={titleId} className="text-2xl font-bold text-green-700 mb-6 text-center">
          Inventaire de {type}
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-2 items-center border-b border-gray-100 pb-3"
              >
                <input
                  type="text"
                  placeholder="Nom de l’objet"
                  value={item.name}
                  required
                  className="flex-1 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  required
                  className="w-20 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) =>
                    updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                  }
                />
                <select
                  value={item.condition}
                  onChange={(e) => updateItem(item.id, 'condition', e.target.value)}
                  className="w-28 px-2 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond.charAt(0).toUpperCase() + cond.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="ml-1 p-1 rounded hover:bg-red-100 transition"
                  aria-label="Supprimer l’item"
                  tabIndex={-1}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Ajouter un objet */}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-green-600 font-medium px-4 py-2 rounded hover:bg-green-50 transition w-full sm:w-auto justify-center"
          >
            <PlusCircle className="w-5 h-5" /> Ajouter un objet
          </button>

          {/* Boutons bas */}
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Envoi…' : 'Valider l’inventaire'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
