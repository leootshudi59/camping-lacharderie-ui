'use client';
import { Booking } from '@/types/reservation';
import { createContext, useContext, useEffect, useState } from 'react';

type User = { email: string; role: string };

type GuestBooking = Booking;

type AuthCtx = {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;

    // guest
  guestToken: string | null;
  guestBooking: GuestBooking | null;
  isGuest: boolean;
  loginGuest: (token: string, booking: GuestBooking) => void;
  logoutGuest: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /* -------- User/admin auth -------- */
  const [user, setUser]   = useState<User | null>(null);
  const [token, setUserToken] = useState<string | null>(null);

  /* -------- Guest auth -------- */
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [guestBooking, setGuestBooking] = useState<GuestBooking | null>(null);

  /* -------- Restore on refresh -------- */
  useEffect(() => {
    const t   = localStorage.getItem('jwt');
    const u   = localStorage.getItem('user');
    if (t && u) {
      setUserToken(t);
      setUser(JSON.parse(u));
    }

    const gj = localStorage.getItem('guest_jwt');
    const gb = localStorage.getItem('guest_booking');
    if (gj && gb) {
      setGuestToken(gj);
      try { setGuestBooking(JSON.parse(gb)); } catch {}
    }
  }, []);

  const login = (jwt: string, usr: User) => {
    setUserToken(jwt);
    setUser(usr);
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(usr));
  };

  const logout = () => {
    setUserToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  /* -------- guest actions -------- */
  const loginGuest = (token: string, booking: GuestBooking) => {
    setGuestToken(token);
    setGuestBooking(booking);
    localStorage.setItem('guest_jwt', token);
    localStorage.setItem('guest_booking', JSON.stringify(booking));
  };

  const logoutGuest = () => {
    setGuestToken(null);
    setGuestBooking(null);
    localStorage.removeItem('guest_jwt');
    localStorage.removeItem('guest_booking');
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, token, isAdmin: user?.role === 'admin', login, logout, 
        guestToken, guestBooking, isGuest: guestToken !== null, loginGuest, logoutGuest 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}