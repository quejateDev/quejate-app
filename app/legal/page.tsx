
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const LegalPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-8 tracking-tight">Políticas de Privacidad y Términos de Uso</h1>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
            Política de Privacidad
          </h2>
          <p className="text-base text-slate-700 mb-4">
            Tu privacidad es importante para nosotros. Recopilamos y utilizamos tus datos personales únicamente para los fines necesarios para el funcionamiento de la plataforma, cumpliendo con la legislación vigente. No compartimos tu información con terceros sin tu consentimiento, salvo obligación legal.
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>Solo solicitamos los datos estrictamente necesarios para la prestación del servicio.</li>
            <li>Puedes solicitar la eliminación o modificación de tus datos en cualquier momento.</li>
            <li>Utilizamos medidas de seguridad para proteger tu información.</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
            Términos y Condiciones de Uso
          </h2>
          <p className="text-base text-slate-700 mb-4">
            Al utilizar esta plataforma, aceptas los siguientes términos:
          </p>
          <ul className="list-decimal pl-6 text-slate-700 space-y-1">
            <li>Debes proporcionar información veraz y actualizada.</li>
            <li>No está permitido el uso indebido de la plataforma ni la suplantación de identidad.</li>
            <li>Nos reservamos el derecho de suspender cuentas que incumplan estos términos.</li>
            <li>El contenido generado es solo para fines informativos y no constituye asesoría legal.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-primary mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
            Contacto
          </h2>
          <p className="text-base text-slate-700">
            Si tienes dudas sobre nuestras políticas, puedes contactarnos al correo{" "}
            <a href="mailto:soporte@quejate.com" className="text-blue-600 underline hover:text-blue-800">admin@quejate.com</a>.
          </p>
        </section>
        <div className="mt-8 flex justify-end">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;

