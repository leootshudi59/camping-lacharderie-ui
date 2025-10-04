'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, BedDouble, TentTree, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


type Reservation = {
    reservation_id: string;
    start_date: string;
    end_date: string;
    res_name: string;
    email?: string;
    phone?: string;
};

type RentalDetailsProps = {
    rental: {
        campsite_id: string;
        name: string;
        type: string;
        description: string;
        status: 'Disponible' | 'Occupé' | 'Problème';
        image?: string;
        current_reservation?: Reservation;
    };
};

const statusLabels: Record<string, { label: string; color: string; icon: React.JSX.Element }> = {
    disponible: {
        label: 'Disponible',
        color: 'bg-green-100 text-green-800',
        icon: <BadgeCheck className="w-4 h-4 mr-1" />,
    },
    occupé: {
        label: 'Occupé',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <BedDouble className="w-4 h-4 mr-1" />,
    },
    problème: {
        label: 'Problème',
        color: 'bg-red-100 text-red-800',
        icon: <AlertTriangle className="w-4 h-4 mr-1" />,
    },
};

export default function RentalDetails({ rental }: RentalDetailsProps) {
    const { name, type, description, status, image, current_reservation } = rental;
    const statusInfo = statusLabels[status];
    const router = useRouter();


    return (
        <div className="w-full bg-white rounded-xl shadow p-4 sm:p-6">
            {/* Image */}
            <div className="w-full mb-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <TentTree className="w-10 h-10" />
                        </div>
                    )}
                </div>
            </div>

            {/* Infos */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{type}</p>
                </div>

                <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                    </span>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                        Description
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{description}</p>
                </div>
            </div>
            {current_reservation && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Réservation en cours</h3>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Nom :</span> {current_reservation.res_name}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Dates :</span>{' '}
                        {format(new Date(current_reservation.start_date), 'dd MMM yyyy', { locale: fr })} →{' '}
                        {format(new Date(current_reservation.end_date), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    {current_reservation.email && (
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Email :</span> {current_reservation.email}
                        </p>
                    )}
                    {current_reservation.phone && (
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Téléphone :</span> {current_reservation.phone}
                        </p>
                    )}

                    <div className="mt-3 text-right">
                        <button
                            className="text-green-600 text-sm font-semibold hover:underline"
                            onClick={() => router.push(`/admin/bookings/${current_reservation.reservation_id}`)}
                        >
                            Voir la fiche
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}