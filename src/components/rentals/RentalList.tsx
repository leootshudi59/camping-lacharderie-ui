'use client';

import { useState } from 'react';
import { Eye, Pencil, PlusCircle } from 'lucide-react';
import RentalForm, { RentalFormData } from './RentalForm';
import RentalDetails from './RentalDetails';
import { mockRentals } from '@/mocks/mockRentals';
import { Rental } from '@/types/rental';


const statusColors: Record<string, string> = {
    'disponible': 'bg-green-100 text-green-800',
    'occupé': 'bg-yellow-100 text-yellow-800',
    'problème': 'bg-red-100 text-red-800',
};


export default function RentalList() {
    const [rentals, setRentals] = useState<Rental[]>(mockRentals);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState<RentalFormData | null>(null);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedDetailsRental, setSelectedDetailsRental] = useState<Rental | null>(null);

    const handleViewClick = (rental: Rental) => {
        setSelectedDetailsRental(rental);
        setDetailsModalOpen(true);
    };


    const handleAddClick = () => {
        setSelectedRental(null);
        setModalOpen(true);
    };

    const handleEditClick = (rental: Rental) => {
        setSelectedRental(rental);
        setModalOpen(true);
    };

    const handleSubmit = (data: RentalFormData) => {
        if (data.rental_id) {
            setRentals((prev) =>
                prev.map((r) => (r.rental_id === data.rental_id ? { ...r, ...data } : r))
            );
        } else {
            setRentals((prev) => [
                ...prev,
                { ...data, rental_id: Math.random().toString(36).substring(2, 9) },
            ]);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Locatifs / Hébergements</h1>
                <button
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                    onClick={handleAddClick}
                >
                    + Ajouter un locatif
                </button>
            </div>

            {/* Vue tableau (desktop) */}
            <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nom</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Image</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Statut</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rentals.map((rental) => (
                            <tr key={rental.rental_id} className="hover:bg-green-50 transition">
                                <td className="px-4 py-3 font-semibold text-gray-800">{rental.name}</td>
                                <td className="px-4 py-3 text-gray-600">{rental.type}</td>
                                <td className="px-4 py-3 text-gray-500">{rental.description}</td>
                                <td className="px-4 py-3">
                                    {rental.image ? (
                                        <img src={rental.image} alt="" className="w-20 h-14 object-cover rounded-md" />
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Aucune</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[rental.status]}`}>
                                        {rental.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex justify-center gap-2">
                                    <button
                                        className="p-2 rounded hover:bg-green-100"
                                        onClick={() => handleViewClick(rental)}
                                    >
                                        <Eye className="w-5 h-5 text-green-600" />
                                    </button>
                                    <button
                                        className="p-2 rounded hover:bg-yellow-100"
                                        onClick={() => handleEditClick(rental)}
                                    >
                                        <Pencil className="w-5 h-5 text-yellow-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vue mobile (card) */}
            <div className="space-y-4 sm:hidden">
                {rentals.map((rental) => (
                    <div
                        key={rental.rental_id}
                        className="bg-white rounded-xl shadow p-4 space-y-2"
                    >
                        {rental.image && (
                            <img
                                src={rental.image}
                                alt={`Image de ${rental.name}`}
                                className="w-full h-40 object-cover rounded-md"
                            />
                        )}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{rental.name}</h3>
                                <p className="text-sm text-gray-500">{rental.type}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[rental.status]}`}>
                                {rental.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">{rental.description}</p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                className="p-2 rounded hover:bg-green-100"
                                onClick={() => handleViewClick(rental)}
                            >
                                <Eye className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                                className="p-2 rounded hover:bg-yellow-100"
                                onClick={() => handleEditClick(rental)}
                            >
                                <Pencil className="w-5 h-5 text-yellow-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Modal */}
            <RentalForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedRental || undefined}
            />
            {detailsModalOpen && selectedDetailsRental && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg relative animate-in fade-in zoom-in-90">
                        <button
                            onClick={() => setDetailsModalOpen(false)}
                            className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
                        >
                            <span className="sr-only">Fermer</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <RentalDetails rental={selectedDetailsRental} />
                    </div>
                </div>
            )}
        </div>
    );
}