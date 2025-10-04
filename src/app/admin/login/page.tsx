import type { Metadata } from "next";
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: "Connexion admin",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin/login" },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-gray-50">
      <AuthForm />
    </div>
  );
}