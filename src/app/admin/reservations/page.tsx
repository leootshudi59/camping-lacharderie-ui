import ReservationList from '@/components/reservations/ReservationList';

export default function ReservationPage() {
  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-bold text-gray-800">Réservations en cours</h1> */}
      <ReservationList />
    </div>
  );
}