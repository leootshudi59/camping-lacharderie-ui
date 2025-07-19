import AuthForm from '@/components/auth/AuthForm';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-gray-50">
      <AuthForm />
    </div>
  );
}