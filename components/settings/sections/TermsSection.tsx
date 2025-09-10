'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TermsSection() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/terms');
  };

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Términos y Condiciones</CardTitle>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>
            Consulta nuestros términos y condiciones de uso.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
