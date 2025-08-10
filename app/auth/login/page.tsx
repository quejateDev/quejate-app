"use client";

import { Suspense } from 'react';
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <LoginForm />
    </Suspense>
  );
}