import ContactForm from '../../components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contacto — JSPP.es',
  description: 'Ponte en contacto con el equipo de JSPP.es. Formulario directo conectado con SPP Labs API.',
};

export default function ContactoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Formulario de <span className="text-indigo-400">Contacto</span>
        </h1>
        <p className="text-sm text-zinc-400">
          ¿Tienes preguntas o deseas solicitar un presupuesto? Completa el siguiente formulario o escríbenos directamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="space-y-6 p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white mb-6">Información Directa</h2>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
            <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Correo Electrónico</p>
              <p className="text-zinc-400">contacto@jspp.es</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
            <Phone className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Atención Telefónica</p>
              <p className="text-zinc-400">+34 912 345 678</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Dominio Registrado</p>
              <p className="text-zinc-400">jspp.es (España)</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 pt-4 border-t border-zinc-800">
            <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Horario de Atención</p>
              <p className="text-zinc-400">Lunes a Viernes: 09:00 - 18:00 CEST</p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
