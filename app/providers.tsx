'use client';

import { AuthStoreProvider } from '@/providers/auth-store-provider';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthStoreProvider>
      <Toaster />
      {children}
    </AuthStoreProvider>
  );
}