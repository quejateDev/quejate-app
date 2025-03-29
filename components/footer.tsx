import { FacebookIcon, InstagramIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Quejate</h3>
            <p className="text-gray-400">
              Solución integral para la gestión de PQRSD en tu organización
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p className="text-gray-400">
              Email: admin@quejate.com.co
              <br />
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/qujateco/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/qujateco/" target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="w-6 h-6" />
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
