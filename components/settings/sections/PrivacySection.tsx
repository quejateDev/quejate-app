'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PrivacySection() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/policy');
  };

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Política de Privacidad</CardTitle>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>
          Consulta nuestra política de privacidad y tratamiento de datos.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
