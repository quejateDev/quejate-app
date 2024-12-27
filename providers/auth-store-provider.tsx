'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

interface AuthStoreProviderProps {
  children: React.ReactNode;
}

export function AuthStoreProvider({ children }: AuthStoreProviderProps) {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Hydration check
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth-storage');
      if (storedAuth) {
        const { state } = JSON.parse(storedAuth);
        if (state.user && !user) {
          useAuthStore.setState({ user: state.user, isAuthenticated: true });
        }
      }
    }
  }, [user]);

  return <>{children}</>;
}