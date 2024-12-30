"use client";

import { ClientForm } from "@/components/forms/client-form";

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Nuevo Cliente</h1>
      <ClientForm mode="create" />
    </div>
  );
}
