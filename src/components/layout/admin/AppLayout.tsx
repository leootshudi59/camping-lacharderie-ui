'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-auto">
                <header className="flex items-center justify-between bg-white shadow-sm p-4 sticky top-0 z-10">
                    <button
                        className="md:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Ouvrir menu"
                    >
                        <Menu className="w-6 h-6 text-green-600" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-700">Gestion du Camping</h2>
                </header>

                {/* Dynamic Content */}
                <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)] overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}