import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full bg-tertiary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch min-h-[400px] md:min-h-[500px]">
          <div className="flex flex-col justify-center space-y-4 md:space-y-6 text-white md:w-1/2 py-8 md:py-12 lg:py-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight">
              Haz valer tus derechos con un clic
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-medium opacity-90">
              ¿Tienes alguna petición, queja, reclamo, sugerencia o denuncia?
            </h2>
            <div className="pt-2 md:pt-4">
              <Link href="/dashboard/pqrs/create">
                <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base">
                  <PlusIcon className="h-4 w-4" />
                  <span>Crear PQRSD</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end items-stretch order-first md:order-last">
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] h-[300px] md:h-full">
              <Image
                src="/comunidad.png"
                alt="Ilustración de derechos"
                fill
                className="object-contain md:object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}