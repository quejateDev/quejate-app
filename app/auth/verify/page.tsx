// Ejemplo: app/auth/verify/page.tsx
"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
    }
  }, [error]);

  return (
    <div>
      {error ? (
        <p>Error al verificar el enlace. Intenta nuevamente.</p>
      ) : (
        <p>Verificando tu sesión...</p>
      )}
    </div>
  );
}