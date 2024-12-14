export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tu queja</h3>
            <p className="text-gray-400">
              Solución integral para la gestión de PQRS en tu organización
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p className="text-gray-400">
              Email: contacto@tuqueja.com
              <br />
              Tel: +57 (1) 123 4567
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {/* Aquí puedes agregar íconos de redes sociales */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
