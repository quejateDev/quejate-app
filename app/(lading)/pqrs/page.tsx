import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewPQRForm } from "@/components/forms/new-pqr";

export default function PQRS() {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Gestión de PQRS
          </h1>

          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Nueva PQRS</TabsTrigger>
              <TabsTrigger value="list">Mis PQRS</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <NewPQRForm />
            </TabsContent>
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de PQRS</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Aquí puedes mostrar la lista de PQRS */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
