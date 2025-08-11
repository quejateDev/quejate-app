'use client';

import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}