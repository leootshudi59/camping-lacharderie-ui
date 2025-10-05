'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardCheck, ShoppingCart, AlertTriangle, CalendarDays, Info, LogOut, Calendar } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/admin' },
  { name: 'Locatifs', icon: Home, href: '/admin/campsites' },
  { name: 'Réservations', icon: Calendar, href: '/admin/bookings' },
  { name: 'Inventaires', icon: ClipboardCheck, href: '/admin/inventories' },
  { name: 'Commandes', icon: ShoppingCart, href: '/admin/orders' },
  { name: 'Problèmes', icon: AlertTriangle, href: '/admin/issues' },
  { name: 'Événements', icon: CalendarDays, href: '/admin/events' },
  { name: 'Infos Pratiques', icon: Info, href: '/admin/news' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 w-64 md:relative md:translate-x-0`}>
        <div className="flex flex-col h-full p-4">
          <h1 className="text-xl font-bold mb-4 text-green-600">🏕️ Camping Admin</h1>
          <nav className="flex-1 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <div className={`flex items-center p-2 rounded-lg hover:bg-green-100 ${pathname === item.href ? 'bg-green-100' : ''}`}>
                    <Icon className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <button className="mt-auto flex items-center p-2 rounded-lg hover:bg-red-100 text-red-600">
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay pour fermer sidebar sur mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}