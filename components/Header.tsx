import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full bg-tertiary">
      <div className="container mx-auto px-8 md:px-16 lg:px-18 xl:px-20"> 
        <div className="flex flex-col md:flex-row justify-between items-stretch min-h-[180px] lg:min-h-[240px]">
          <div className="flex flex-col justify-center space-y-2 md:space-y-3 text-white md:w-2/3 py-6 md:py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-semibold leading-tight">
              Haz valer tus derechos con un clic
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg font-medium opacity-90">
              ¿Tienes alguna petición, queja, reclamo, sugerencia o denuncia?
            </h2>
            <div className="pt-1 md:pt-2">
              <Link href="/dashboard/pqrs/create">
                <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2 h-10 px-4 sm:px-5 text-sm sm:text-base">
                  <PlusIcon className="h-4 w-4" />
                  <span>Crear PQRSD</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:w-1/3 justify-center md:justify-end items-stretch">
            <div className="relative w-full max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] h-full">
              <Image
                src="/mensajes.png"
                alt="Ilustración de derechos"
                fill
                className="object-contain object-center"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}