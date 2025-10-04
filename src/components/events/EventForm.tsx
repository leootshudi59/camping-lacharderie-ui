'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Event } from '@/types/event';
import { notifySuccess, notifyError } from '@/lib/toast';

export type EventFormData = {
  event_id: string;
  title: string;
  description?: string;
  start_date: string; // format ISO 'YYYY-MM-DDTHH:mm'
  end_date: string;   // format ISO 'YYYY-MM-DDTHH:mm'
  location?: string;
};

const defaultData: EventFormData = {
  event_id: '',
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
};

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Event) => void;
  initialData?: Event;
};

export default function EventForm({ isOpen, onClose, onSubmit, initialData }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(initialData || defaultData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData(defaultData);
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ... appel API ou mock ...
      notifySuccess(formData.event_id ? 'Événement mis à jour !' : 'Événement créé !');
      onSubmit?.(formData);      // logique existante
      onClose();                 // ferme la modale
    } catch (err) {
      notifyError('Erreur : impossible d’enregistrer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative animate-in fade-in zoom-in-90">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-xl font-bold text-green-700 mb-2 text-center">
          {formData.event_id ? 'Modifier un événement' : 'Créer un événement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Titre de l'événement"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Description détaillée…"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Début</label>
              <input
                type="datetime-local"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fin</label>
              <input
                type="datetime-local"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lieu</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Lieu de l'événement"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {formData.event_id ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}