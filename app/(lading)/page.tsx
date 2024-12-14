"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, BarChart2, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 text-white">Tu Queja</h1>
            <p className="text-xl text-gray-100 mb-8">
              Gestiona tus Peticiones, Quejas, Reclamos y Sugerencias de manera
              eficiente
            </p>
            <Link href="/login">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Comienza Ahora
              </Button>
            </Link>
          </div>

          {/* <div className="mt-12 flex justify-center">
            <Image
              src="/dashboard-mockup.png" // Asegúrate de tener esta imagen en tu carpeta public
              alt="Dashboard PQRS"
              width={800}
              height={450}
              className="rounded-lg shadow-2xl"
            />
          </div> */}
        </div>
      </div>

      {/* Características */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          ¿Por qué elegir nuestra plataforma?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-indigo-600">
                Respuesta Rápida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Gestiona y responde solicitudes en tiempo récord con nuestro
                sistema automatizado
              </p>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart2 className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-purple-600">
                Análisis Detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Obtén insights valiosos con nuestras herramientas de análisis y
                reportes
              </p>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <CardTitle className="text-pink-600">
                Seguridad Garantizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Protección de datos y cumplimiento normativo asegurado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección CTA */}
        <div className="max-w-4xl mx-auto text-center py-16">
          <Card className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para gestionar tus PQRS?
              </h3>
              <p className="text-xl mb-8">
                Accede a nuestra plataforma especializada y comienza a gestionar
                tus solicitudes de manera eficiente
              </p>
              <Link href="/login">
                <Button
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  Crear PQRS
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
