"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";
import Link from "next/link";

export const RegisterForm = () => {

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
    });
  }

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel="¿Ya tienes cuenta?"
      backButtonHref="/auth/login"
      showSocial
    
    >
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6" 
        >

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nombre completo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Juan Pérez"
                      className="h-11 border border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
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
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default RegisterForm;