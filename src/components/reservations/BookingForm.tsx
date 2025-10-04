'use client';

import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

/* ──────────────── Types ──────────────── */
export type BookingFormData = {
  booking_id?: string;        // présent si édition
  res_name: string;           // nom / intitulé de la réservation
  campsite_id: string;      // nom de l’emplacement (ou campsite_id si vous préférez)
  start_date: string;         // ISO yyyy-mm-dd (input date)
  end_date:   string;
  email?: string;
  phone?: string;
};

const defaultData: BookingFormData = {
  res_name:       '',
  campsite_id:  '',
  start_date:     '',
  end_date:       '',
  email:          '',
  phone:          '',
};

/* ──────────────── Props ──────────────── */
type BookingFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BookingFormData) => void;
  initialData?: BookingFormData;        // passé si édition
  campsites?: { campsite_id: string; name: string; type?: string }[];
};

/* ──────────────── Component ──────────────── */
export default function BookingForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  campsites,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>(
    initialData || defaultData
  );

  // refs for accessibility (RGAA)
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'booking-dialog-title';

  /* reset quand on ouvre / change de réservation */
  useEffect(() => {
    if (initialData) setFormData(initialData);
    else             setFormData(defaultData);
  }, [initialData, isOpen]);

  /* gestion des champs texte / dates */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-90 border border-gray-200">

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-500" aria-hidden="true" focusable="false" />
        </button>

        {/* Titre */}
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          {formData.booking_id ? 'Modifier la réservation' : 'Ajouter une réservation'}
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nom réservation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom de la réservation
            </label>
            <input
              type="text"
              name="res_name"
              required
              value={formData.res_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          {/* Emplacement / locatif */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hébergement / Emplacement
            </label>
            <select
                name="campsite_id"
                required
                value={formData.campsite_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
                <option value="">Choisir un hébergement...</option>
                {campsites?.map(c => (
                <option key={c.campsite_id} value={c.campsite_id}>
                    {c.name} {c.type ? `— ${c.type}` : ''}
                </option>
                ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Arrivée
              </label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Départ
              </label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="facultatif"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="facultatif"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          {/* Boutons */}
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
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
            >
              {formData.booking_id ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}