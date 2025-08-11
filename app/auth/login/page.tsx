"use client";

import { Suspense } from 'react';
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen">
      <Suspense fallback={<div>Cargando formulario...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}