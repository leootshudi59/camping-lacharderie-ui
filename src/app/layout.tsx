'use client';
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import MainLayout from "@/components/layout/main/MainLayout";
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const content = pathname.startsWith('/admin') ? children : <MainLayout>{children}</MainLayout>;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {content}
          <Toaster 
          position="top-right"
          gutter={8}
          toastOptions={{
            className: 'font-medium',
            style: { paddingInline: '12px' },
            success: { className: 'bg-green-600 text-white' },
            error: { className: 'bg-red-600 text-white' },
          }}
        />
        </AuthProvider>
      </body>
    </html>
  );
}