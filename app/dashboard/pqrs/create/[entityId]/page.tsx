import { NewPQRForm } from "@/components/forms/new-pqr";

export default async function NewPQR({ params }: any) {
  const { entityId} = await params;

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto p-4 md:p-8">
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
          <h1 className="pt-6 text-3xl font-bold mb-6 md:mb-8 text-center">
            Crear Nueva PQRSD
          </h1>
          <NewPQRForm entityId={entityId} />
        </div>
      </main>
    </div>
  );
}
