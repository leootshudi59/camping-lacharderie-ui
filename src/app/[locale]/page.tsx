
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';
import ClientHome from "@/components/client/ClientHome";

export default function Home() {
  return (
    <ClientAuthGuard>
      <ClientHome />
    </ClientAuthGuard>
  );
}
