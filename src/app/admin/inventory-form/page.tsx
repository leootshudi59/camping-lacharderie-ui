// 'use client';

// import InventoryForm from '@/components/inventories/InventoryForm';
// import { useSearchParams } from 'next/navigation';

// export default function InventoryFormPage() {
//   const searchParams = useSearchParams();

//   const reservationId = searchParams.get('reservation_id');
//   const rentalId = searchParams.get('rental_id');
//   const type = searchParams.get('type') === 'depart' ? 'depart' : 'arrivee';

//   if (!reservationId || !rentalId) {
//     return <p className="text-red-500 text-center mt-10">Paramètres manquants</p>;
//   }

//   return (
//     <div className="p-4">
//       <InventoryForm
//         type={type}
//         onSubmit={(items) => {
//           console.log('Envoi inventaire pour réservation', reservationId);
//           console.table(items);
//         }}
//         i
//       />
//     </div>
//   );
// }