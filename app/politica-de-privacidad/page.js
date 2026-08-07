import Link from 'next/link';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad — JSPP.es',
  description: 'Política de Privacidad y Protección de Datos según el Reglamento General de Protección de Datos (RGPD) y LOPDGDD.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-zinc-300 space-y-8">
      <div className="border-b border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Protección de Datos RGPD & LOPDGDD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Política de Privacidad</h1>
        <p className="text-xs text-zinc-400">Última actualización: Agosto de 2026 &bull; Dominio: jspp.es</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Responsable del Tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos personales recabados a través de <strong className="text-white">jspp.es</strong> es el titular del sitio web, en colaboración con el proveedor de infraestructura tecnológica <strong className="text-white">SPP Labs Ecosystem</strong> (API Gateway: <code className="text-indigo-300">https://api.spplabs.es</code>).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Datos Personales Recabados</h2>
          <p>Tratamos los siguientes datos personales facilitados voluntariamente por el usuario:</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Formulario de contacto: Nombre completo, dirección de correo electrónico, teléfono y mensaje.</li>
            <li>Formulario de reservas: Nombre completo, correo electrónico, teléfono, fecha y hora de la cita.</li>
            <li>Widget de asistencia IA: Histórico de mensajes enviado de forma anonimizada durante la sesión.</li>
            <li>Analítica web: Identificadores únicos de visitante (<code className="text-indigo-300">spp_visitor_id</code>) y sesión (<code className="text-indigo-300">spp_session_id</code>), dirección IP anonimizada mediante HASH SHA-256.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Finalidad y Legitimación</h2>
          <p>
            La recogida y tratamiento de sus datos responde a la gestión de consultas, reserva de citas, asistencia mediante IA y evaluación analítica de tráfico en la base de datos ClickHouse Database de SPP Labs. La base legal es el consentimiento explícito brindado al enviar los formularios o aceptar la política de cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Derechos ARCO / RGPD</h2>
          <p>
            Puede ejercer sus derechos de acceso, rectificación, supresión, limitación y oposición dirigiéndose a nuestro canal de soporte en <Link href="/contacto" className="text-indigo-400 hover:underline">nuestra página de contacto</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
