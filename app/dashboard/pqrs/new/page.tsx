import { NewPQRForm } from "@/components/forms/new-pqr";

export default function NewPQR() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Crear Nueva PQRS
          </h1>
          <NewPQRForm />
        </div>
      </main>
    </div>
  );
}
