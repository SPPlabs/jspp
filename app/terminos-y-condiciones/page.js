import Link from 'next/link';
import { FileText, Shield, Scale } from 'lucide-react';

export const metadata = {
  title: 'Términos y Condiciones — JSPP.es',
  description: 'Términos y condiciones legales de uso del sitio web JSPP.es e integración con los servicios de SPP Labs.',
};

export default function TerminosCondicionesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-zinc-300 space-y-8">
      <div className="border-b border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Scale className="w-4 h-4" />
          <span>Aviso Legal & Condiciones de Servicio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Términos y Condiciones</h1>
        <p className="text-xs text-zinc-400">Última actualización: Agosto de 2026 &bull; Dominio: jspp.es</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Objeto y Ámbito de Aplicación</h2>
          <p>
            Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web <strong className="text-white">jspp.es</strong>. El acceso a este sitio atribuye la condición de Usuario e implica la aceptación plena de todas las condiciones aquí expuestas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Servicios y Reservas en Línea</h2>
          <p>
            El sistema de reservas disponible en este sitio web permite solicitar citas previas directamente conectadas al motor de gestión de SPP Labs. Las reservas están sujetas a disponibilidad de franjas horarias y al cumplimiento de límites de frecuencia de uso.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Propiedad Intelectual e Industrial</h2>
          <p>
            Todos los contenidos del sitio web (diseños, textos, marcas, logotipos, imágenes y código fuente Next.js / Tailwind CSS) son propiedad exclusiva de JSPP.es o de sus licenciantes, estando protegidos por la legislación sobre Propiedad Intelectual.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Limitación de Responsabilidad</h2>
          <p>
            JSPP.es no se hace responsable de las interrupciones temporales del servicio derivadas de mantenimientos de la red, caídas de la pasarela de API o fuerza mayor, manteniendo en todo momento las máximas medidas de seguridad y redundancia.
          </p>
        </section>
      </div>
    </div>
  );
}
