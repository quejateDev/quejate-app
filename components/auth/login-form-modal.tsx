"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";  
import Link from "next/link";
import { useLoginModal } from "@/providers/LoginModalProvider";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

export const LoginFormModal = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Este correo ya está asociado con otra cuenta" : "";
  const { setIsOpen } = useLoginModal();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);

          if (data?.success) {
            setIsOpen(false);
          }
        })
    });
  }

  return (
    <div className="w-full space-y-4">
      <Header label="" />

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4" 
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isPending}
                      placeholder="tucorreo@ejemplo.com"
                      className="h-11 border border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      placeholder="••••••••"
                      className="h-11 border border-gray-300"
                    />
                  </FormControl>
                  <div className="text-right">
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal text-blue-600 hover:text-blue-800"
                    >
                      <Link href="/auth/reset">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <div className="text-xs text-gray-600">
            Al registrarte o iniciar sesión, aceptas automáticamente nuestros{' '}
            <Link 
              href="/terms" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Términos y Condiciones
            </Link>
            {' '}y{' '}
            <Link 
              href="/policy" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Política de Privacidad
            </Link>
            .
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 font-medium">
            {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
          
        <Social />

      <div className="text-center">
        <BackButton 
          label="¿No tienes cuenta?"
          href="/auth/register"
        />
      </div>
    </div>
  );
}

export default LoginFormModal;
