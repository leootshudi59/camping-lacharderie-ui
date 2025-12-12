'use client';
import { useTranslations } from 'next-intl';
import { Home, AlertTriangle, ShoppingCart, CalendarDays, MapPinned, LogOut } from 'lucide-react';
import { Link, useRouter, usePathname } from "@/i18n/routing";
import LanguageSwitcher from '@/components/ui/LangageSwitcher';


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { key: "home", icon: Home, href: "/" },
  { key: "inventory", icon: AlertTriangle, href: "/inventory" },
  { key: "orders", icon: ShoppingCart, href: "/orders" },
  { key: "events", icon: CalendarDays, href: "/events" },
  { key: "map", icon: MapPinned, href: "/map" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Sidebar');

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 w-64 md:relative md:translate-x-0`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h1 className="text-xl font-bold text-green-600">
              {t("welcome")}
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <div className={`flex items-center p-2 rounded-lg hover:bg-green-100 ${pathname === item.href ? 'bg-green-100' : ''}`}>
                    <Icon className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-gray-700">{t(`links.${item.key}`)}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <button 
              className="flex items-center justify-center md:justify-start p-2 rounded-lg hover:bg-red-100 text-red-600 w-full md:w-auto"
              onClick={() => {
                localStorage.removeItem('reservationUser');
                router.replace('/login');
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              {t("logout")}
            </button>
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <LanguageSwitcher direction='up' />
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}