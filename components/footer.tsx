import { FacebookIcon, InstagramIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-tertiary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-flow-col md:auto-cols-auto gap-8">
          <div className="min-w-[200px] max-w-[300px]">
            <h3 className="text-md font-semibold mb-4">Quéjate</h3>
            <p className="text-white text-sm">
              Solución integral para la gestión de PQRSD en tu organización.
            </p>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Contacto</h3>
            <p className="text-white text-sm">
              Email: soporte@quejate.com.co
              <br />
            </p>
          </div>
          <div>
            <h3 className="text-md font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/qujateco/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/qujateco/" target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="w-6 h-6" />
              </a>
              
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Legal</h3>
            <a
                href="/legal"
                className="hover:text-quaternary text-sm transition-colors duration-300"
              >
                Términos y Condiciones
              </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
