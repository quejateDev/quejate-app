"use client";

import { LawyerProfileCard } from "@/components/lawyer";


export default function LawyerDashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">

      <LawyerProfileCard />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Solicitudes Recibidas</h2>
        <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
          Aquí aparecerán las solicitudes que has recibido de clientes.
        </div>
      </div>
    </div>
  );
}
