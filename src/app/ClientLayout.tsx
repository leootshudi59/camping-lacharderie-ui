// src/app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import MainLayout from "@/components/layout/main/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const content = pathname.startsWith("/admin") ? children : <MainLayout>{children}</MainLayout>;

  return (
    <AuthProvider>
      <AppProvider>
        {content}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            className: "font-medium",
            style: { paddingInline: "12px" },
            success: { className: "bg-green-600 text-white" },
            error: { className: "bg-red-600 text-white" },
          }}
        />
      </AppProvider>
    </AuthProvider>
  );
}
