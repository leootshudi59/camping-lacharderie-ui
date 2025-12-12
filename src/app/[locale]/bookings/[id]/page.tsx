import ReservationDetails from '@/components/reservations/ReservationDetails';
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';
import ClientBookingResolver from '@/components/client/ClientBookingResolver';

export default async function ClientBookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <ClientAuthGuard>
            <div className="py-6">
                <ClientBookingResolver id={id} />
            </div>
        </ClientAuthGuard>
    );
}