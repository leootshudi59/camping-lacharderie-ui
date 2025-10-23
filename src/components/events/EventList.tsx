'use client';

import { useEffect, useState } from 'react';
import { mockEvents } from '@/mocks/mockEvents';
import { Event } from '@/types/event';
import EventForm from './EventForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Loader from '@/components/ui/Loader';


export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => {
    try {
      return localStorage.getItem('jwt') ?? '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        console.log("events", data)
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);   // on « reçoit » les données
      setLoading(false);       // on coupe le spinner
    }, 600);                   // 0,6 s de latence simulée
    return () => clearTimeout(timer);
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedEvent(undefined);
    setModalOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSubmit = (data: Event) => {
    if (data.event_id && events.find(e => e.event_id === data.event_id)) {
      // Edition
      setEvents(prev => prev.map(e => (e.event_id === data.event_id ? { ...e, ...data } : e)));
    } else {
      // Création
      setEvents(prev => [
        ...prev,
        { ...data, event_id: data.event_id || Math.random().toString(36).slice(2, 9) },
      ]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Événements / Animations</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          onClick={handleAddClick}
        >
          + Ajouter un événement
        </button>
      </div>

      {loading ? <Loader size={12} className="py-16" /> : (
        <>
          {/* Table desktop */}
          <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Titre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Début</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Lieu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.event_id} className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">{event.title}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(event.start_date), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {format(new Date(event.end_date), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{event.location}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="p-2 rounded hover:bg-yellow-100"
                        onClick={() => handleEditClick(event)}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4">
            {events.map((event) => (
              <div key={event.event_id} className="bg-white rounded-xl shadow p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.start_date), 'dd MMM yyyy HH:mm', { locale: fr })} –{' '}
                      {format(new Date(event.end_date), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                  </div>
                  <button
                    className="p-2 rounded hover:bg-yellow-100 text-yellow-700 font-medium text-xs"
                    onClick={() => handleEditClick(event)}
                  >
                    Modifier
                  </button>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {/* Modal */}
      <EventForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedEvent}
      />
    </div>
  );
}