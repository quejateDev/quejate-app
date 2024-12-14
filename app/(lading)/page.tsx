import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Empresa Innovadora</h1>
          <p className="text-xl text-gray-600 mb-8">Soluciones inteligentes para tu negocio</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Contáctanos
          </Button>
        </div>

        {/* Servicios */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Consultoría</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Asesoramiento experto para optimizar tus procesos empresariales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desarrollo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Soluciones tecnológicas personalizadas para tu empresa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soporte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Asistencia técnica 24/7 para mantener tu negocio funcionando
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de Contacto */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Contáctanos</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Tu nombre completo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Servicio de interés</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consulting">Consultoría</SelectItem>
                      <SelectItem value="development">Desarrollo</SelectItem>
                      <SelectItem value="support">Soporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Ingresa tu descripción"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Archivos Adjuntos</Label>
                  <Input
                    id="files"
                    type="file"
                    className="cursor-pointer"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <p className="text-sm text-gray-500">
                    Formatos permitidos: PDF, DOC, DOCX, PNG, JPG (Máx. 5MB por archivo)
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Enviar PQRS
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
