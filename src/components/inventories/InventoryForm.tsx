'use client';

import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  condition: string;
};

type InventoryFormProps = {
  type: 'arrivée' | 'départ';
  initialItems?: InventoryItem[];
  onSubmit?: (items: InventoryItem[]) => void;
};

const CONDITIONS = ['bon', 'abîmé', 'cassé', 'manquant'];

export default function InventoryForm({
  type,
  initialItems = [],
  onSubmit,
}: InventoryFormProps) {
  const [items, setItems] = useState<InventoryItem[]>(
    initialItems.length
      ? initialItems
      : [
          { id: '1', name: 'Casserole', quantity: 2, condition: 'bon' },
          { id: '2', name: 'Assiette', quantity: 4, condition: 'bon' },
          { id: '3', name: 'Chaise', quantity: 4, condition: 'bon' },
        ]
  );
  const [loading, setLoading] = useState(false);

  // Ajout d'un nouvel item
  const addItem = () => {
    setItems([
      ...items,
      {
        id: (Math.random() + '').slice(2),
        name: '',
        quantity: 1,
        condition: 'bon',
      },
    ]);
  };

  // Suppression d'un item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Modification d'un champ d'item
  const updateItem = (id: string, field: keyof InventoryItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Appel backend à intégrer ici, pour l’instant on mock
    if (onSubmit) {
      onSubmit(items);
    } else {
      alert('Inventaire envoyé !');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-6 max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold text-green-700 mb-2 text-center">
        Inventaire de {type}
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
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
              onChange={(e) =>
                updateItem(item.id, 'name', e.target.value)
              }
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
              onChange={(e) =>
                updateItem(item.id, 'condition', e.target.value)
              }
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
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-green-600 font-medium px-4 py-2 rounded hover:bg-green-50 transition w-full sm:w-auto justify-center"
      >
        <PlusCircle className="w-5 h-5" /> Ajouter un objet
      </button>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Envoi…' : 'Valider l\'inventaire'}
      </button>
    </form>
  );
}