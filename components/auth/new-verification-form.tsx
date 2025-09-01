"use client";

import { CardWrapper } from "./card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useSearchParams } from "next/navigation";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("No se proporcionó un token de verificación válido. Por favor, verifica que hayas seguido el enlace completo desde tu correo electrónico.");
      setIsLoading(false);
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError("Ocurrió un error inesperado al procesar la verificación. Por favor, inténtalo de nuevo o contacta soporte.");
        setIsLoading(false);
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      backButtonLabel="Volver al login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {isLoading && (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full"></div>
            <div className="text-sm text-muted-foreground">Verificando tu correo electrónico...</div>
          </div>
        )}
        
        {success && (
          <div className="flex flex-col items-center space-y-4">
            <FormSuccess message={success} />
            <div className="text-sm text-muted-foreground text-center">
              Ahora puedes cerrar esta ventana y proceder a iniciar sesión.
            </div>
          </div>
        )}
        
        {error && !success && (
          <div className="flex flex-col items-center space-y-4">
            <FormError message={error} />
            <div className="text-xs text-muted-foreground text-center max-w-md">
              {error.includes("ya fue utilizado") && (
                "Si ya verificaste tu cuenta anteriormente, simplemente inicia sesión normalmente."
              )}
              {error.includes("expirado") && (
                "Los enlaces de verificación tienen un tiempo limitado por seguridad."
              )}
            </div>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};
