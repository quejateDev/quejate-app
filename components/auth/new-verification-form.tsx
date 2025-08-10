"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = ({ token }: { token?: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token no proporcionado");
      return;
    }

    newVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => {
        setError("Ocurrió un error al procesar la verificación");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirma tu correo"
      backButtonLabel="Volver al login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <div className="text-sm text-muted-foreground">Verificando...</div>
        )}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
