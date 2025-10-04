'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle, BadgeCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Issue } from '@/types/issue';

type IssueDetailsProps = {
  issue: Issue;
  onClose?: () => void;
};

const statusLabels: Record<string, { label: string; color: string; icon: React.JSX.Element }> = {
  open: {
    label: 'Ouvert',
    color: 'bg-red-100 text-red-800',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />,
  },
  in_progress: {
    label: 'En cours',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Loader2 className="w-4 h-4 mr-1 animate-spin" />,
  },
  resolved: {
    label: 'Résolu',
    color: 'bg-green-100 text-green-800',
    icon: <BadgeCheck className="w-4 h-4 mr-1" />,
  },
};

export default function IssueDetails({ issue, onClose }: IssueDetailsProps) {
  const { title, description, status, created_at, image, rental_name, res_name } = issue;
  const statusInfo = statusLabels[status];

  return (
    <div className="w-full bg-white rounded-xl shadow p-4 sm:p-6">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">
            Créé le {format(new Date(created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100 rounded p-2 transition"
          >
            <span className="sr-only">Fermer</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Statut */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
        >
          {statusInfo.icon}
          {statusInfo.label}
        </span>
      </div>

      {/* Description */}
      {description && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Description</h3>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{description}</p>
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Photo du problème</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Problème signalé" className="object-cover w-full h-full" />
          </div>
        </div>
      )}

      {/* Réservation associée */}
      {(rental_name || res_name) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Réservation associée</h3>
          {rental_name && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Logement :</span> {rental_name}
            </p>
          )}
          {res_name && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Nom :</span> {res_name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}