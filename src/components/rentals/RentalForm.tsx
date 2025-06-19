'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { X, ImagePlus, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

type RentalFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: RentalFormData) => void;
    initialData?: RentalFormData;
};

export type RentalFormData = {
    rental_id?: string;
    name: string;
    type: string;
    description: string;
    status: 'disponible' | 'occupé' | 'problème';
    image?: string; // base64 temporairement
};

const defaultData: RentalFormData = {
    name: '',
    type: '',
    description: '',
    status: 'disponible',
    image: ''
};

export default function RentalForm({ isOpen, onClose, onSubmit, initialData }: RentalFormProps) {
    const [formData, setFormData] = useState<RentalFormData>(initialData || defaultData);

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData(defaultData);
    }, [initialData, isOpen]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                image: reader.result?.toString() || '',
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageClear = () => {
        setFormData((prev) => ({ ...prev, image: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-90 border border-gray-200">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
                    aria-label="Fermer"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                    {formData.rental_id ? 'Modifier le locatif' : 'Ajouter un locatif'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                        <input
                            type="text"
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                            <option value="disponible">Disponible</option>
                            <option value="occupé">Occupé</option>
                            <option value="problème">Problème</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="flex items-center gap-3 mt-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600"
                            />
                        </div>

                        {formData.image && (
                            <div className="relative mt-2 w-full max-h-48 overflow-hidden rounded-md border">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="object-cover w-full h-48"
                                />
                                <button
                                    type="button"
                                    onClick={handleImageClear}
                                    className="absolute top-1 right-1 bg-white bg-opacity-70 p-1 rounded hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>

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
                            {formData.rental_id ? 'Enregistrer' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}