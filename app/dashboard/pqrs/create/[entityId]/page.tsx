import { NewPQRForm } from "@/components/forms/new-pqr";

export default async function NewPQR({ params }: any) {
  const { entityId} = await params;

  console.log(entityId);
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Crear Nueva PQRS
          </h1>
          <NewPQRForm entityId={entityId} />
        </div>
      </main>
    </div>
  );
}
