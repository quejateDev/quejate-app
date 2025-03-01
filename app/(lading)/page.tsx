"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, BarChart2, Shield, CheckCircle, Clock, Users, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { PQRCard } from "@/components/PQRCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { PQRSType } from "@prisma/client";
import { redirect } from "next/navigation";

interface TopPQR {
  id: string;
  type: PQRSType;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  anonymous: boolean;
  creatorId: string;
  departmentId: string;
  department: {
    name: string;
    entity: {
      name: string;
    };
  };
  creator: {
    firstName: string;
    lastName: string;
  };
  customFieldValues: {
    name: string;
    value: string;
  }[];
  _count: {
    likes: number;
  };
}

const stats = [
  { number: "95%", text: "de satisfacción", description: "en resolución de casos" },
  { number: "24/7", text: "disponibilidad", description: "para presentar tu PQR" },
  { number: "+1000", text: "casos resueltos", description: "en el último mes" },
  { number: "48h", text: "promedio", description: "tiempo de respuesta" },
];

const steps = [
  {
    title: "Regístrate",
    description: "Crea tu cuenta en menos de 2 minutos",
    icon: Users,
  },
  {
    title: "Presenta tu PQR",
    description: "Describe tu caso de manera clara y detallada",
    icon: MessageCircle,
  },
  {
    title: "Seguimiento en tiempo real",
    description: "Mantente informado del estado de tu solicitud",
    icon: Clock,
  },
  {
    title: "Resolución garantizada",
    description: "Recibe respuesta dentro del tiempo establecido",
    icon: CheckCircle,
  },
];

export default function Home() {
  redirect("/dashboard");
  return null;
  const [topPQRs, setTopPQRs] = useState<TopPQR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPQRs = async () => {
      try {
        const response = await fetch('/api/pqr/top');
        if (response.ok) {
          const data = await response.json();
          setTopPQRs(data);
        }
      } catch (error) {
        console.error('Error fetching top PQRs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPQRs();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-[1px]" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 10%)`,
            backgroundSize: '25px 25px'
          }} />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              Tu voz importa, nosotros la hacemos escuchar
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200">
              Plataforma líder en gestión de PQRs. Facilitamos la comunicación entre ciudadanos y entidades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-gray-50 hover:text-indigo-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8 h-12 rounded-full"
                >
                  Comienza ahora
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button 
                  size="lg" 
                  className="bg-transparent text-white border-2 border-white/50 hover:border-white hover:bg-white/10 font-semibold transition-all duration-200 px-8 h-12 rounded-full"
                >
                  Cómo funciona
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }} />
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-800 mb-1">{stat.text}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Zap className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Rápido y Eficiente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Respuestas ágiles y seguimiento en tiempo real de tus solicitudes
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Seguro y Confiable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tus datos están protegidos. Opción de presentar PQRs de forma anónima
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart2 className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Transparente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Estadísticas claras y métricas de resolución disponibles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it works section */}
        <section id="como-funciona" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-indigo-200 transform translate-x-1/2">
                        <ArrowRight className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-indigo-400" />
                      </div>
                    )}
                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top PQRs Section */}
        <section className="w-full py-16 bg-gray-50 rounded-2xl">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tal vez te podría interesar</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conoce las mayores inconformidades de tu comunidad
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPQRs.map((pqr) => (
                  <div key={pqr.id} className="relative">
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold z-10 flex items-center gap-1">
                      <Heart className="h-4 w-4 fill-current" />
                      {pqr._count.likes}
                    </div>
                  {/* @ts-ignore */}
                    <PQRCard pqr={pqr} initialLiked={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Lo que dicen nuestros usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Carlos Rodríguez",
                  role: "Usuario",
                  text: "Excelente plataforma. Mi PQR fue atendida en menos de 48 horas.",
                },
                {
                  name: "María González",
                  role: "Ciudadana",
                  text: "Me encanta la transparencia y el seguimiento en tiempo real.",
                },
                {
                  name: "Juan Pérez",
                  role: "Usuario frecuente",
                  text: "La mejor forma de hacer valer nuestros derechos como ciudadanos.",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">{testimonial.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sección CTA */}
        <div className="max-w-4xl mx-auto text-center py-16">
          <Card className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardContent className="pt-12 pb-12 px-6">
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para hacer escuchar tu voz?
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Únete a miles de ciudadanos que ya han encontrado solución a sus
                inquietudes
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold hover:bg-white hover:text-indigo-600"
                >
                  Crear cuenta gratuita
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
