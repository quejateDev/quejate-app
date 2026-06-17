import React from "react";
import Link from "next/link";

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Eliminar tu cuenta - QUEJATE.COM.CO
          </h1>
          <p className="text-gray-600">
            Solicitud de eliminación de tu cuenta y tus datos personales
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Desde tu cuenta
            </h2>
            <p>
              Para eliminar tu cuenta, inicia sesión en{" "}
              <Link
                href="/auth/login"
                className="text-quaternary font-semibold underline"
              >
                quejate.com.co
              </Link>{" "}
              y ve a <strong>Perfil &gt; Configuración &gt; Eliminar cuenta</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Si ya no tienes acceso a tu cuenta
            </h2>
            <p>
              Escríbenos a{" "}
              <a
                href="mailto:soporte@quejate.com.co"
                className="text-quaternary font-semibold underline"
              >
                soporte@quejate.com.co
              </a>{" "}
              solicitando la eliminación de tu cuenta y la eliminaremos en un plazo
              de <strong>30 días</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Qué se elimina
            </h2>
            <p className="mb-3">Al eliminar tu cuenta se eliminarán:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Tu cuenta</li>
              <li>Tus PQRSD</li>
              <li>Tus datos personales</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
