'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type User = { email: string; role: string };
type AuthCtx = {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /* -------- Récupération éventuelle au refresh -------- */
  useEffect(() => {
    const t   = localStorage.getItem('jwt');
    const u   = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const login = (jwt: string, usr: User) => {
    setToken(jwt);
    setUser(usr);
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(usr));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAdmin: user?.role === 'admin', login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}