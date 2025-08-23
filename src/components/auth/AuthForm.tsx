'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import FormField from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCredentialsError(false);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'Invalid credentials') {
          setCredentialsError(true);
        }
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      login(data.token, data.user);
      toast.success('Connexion réussie !');
      router.push('/admin');
    } catch (err: any) {
      console.log("err", err);
      if (err.message === 'Invalid credentials') {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (credentialsError) setCredentialsError(false);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (credentialsError) setCredentialsError(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 sm:p-8 mx-auto mt-20"
    >
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
        Connexion staff / admin
      </h2>

      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        required
        className={credentialsError ? 'border-red-500' : ''}
      />

      <FormField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        required
        className={credentialsError ? 'border-red-500' : ''}
      />

      {credentialsError && (
        <p className="text-red-600 text-sm mt-2 mb-0 text-center">
          Email ou mot de passe incorrect
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}