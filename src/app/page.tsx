import Image from "next/image";
import Link from "next/link";
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';
import { CalendarDays, ShoppingCart, AlertTriangle, MapPinned } from "lucide-react";
import ClientHome from "@/components/client/ClientHome";

export default function Home() {
  return (
    <ClientAuthGuard>
      <ClientHome />
    </ClientAuthGuard>
  );
}
