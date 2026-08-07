import Link from 'next/link';
import { Layout, Smartphone, Calendar, MessageSquareCode, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Servicios Digitales — JSPP.es',
  description: 'Catálogo de servicios profesionales de desarrollo web, reservas online, e integración con la API de SPP Labs.',
};

export default function ServiciosPage() {
  const services = [
    {
      icon: Layout,
      title: 'Desarrollo Web Next.js & Tailwind CSS',
      description: 'Creación de sitios web corporativos y landing pages de alto rendimiento con arquitectura Server-Side Rendering y SSG.',
      features: ['Next.js 15 App Router', 'Optimización SEO nativa', 'Diseño Responsive Premium'],
    },
    {
      icon: Calendar,
      title: 'Sistema de Reservas en Tiempo Real',
      description: 'Integración del calendario interactivo conectado a la API de SPP Labs para la gestión de citas y slots ocupados.',
      features: ['Validación de horarios ocupados', 'Notificaciones de confirmación', 'Control de límites mensual'],
    },
    {
      icon: MessageSquareCode,
      title: 'Asistente de IA Conversacional',
      description: 'Widget de soporte inteligente integrado en la plataforma para responder dudas de clientes 24/7.',
      features: ['Modelo de lenguaje avanzado', 'Persistencia de sesión', 'Control de rate limit (15 req/min)'],
    },
    {
      icon: BarChart3,
      title: 'Analítica de Datos ClickHouse OLAP',
      description: 'Inmunidad y registro de eventos de conversión, clics y visualizaciones de página en base de datos ClickHouse.',
      features: ['Cumplimiento estricto GDPR', 'Métricas de conversión', 'Identificación de sesión y visitante'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Nuestros <span className="text-indigo-400">Servicios Digitales</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Soluciones diseñadas bajo los estándares exigidos por el ecosistema SPP Labs para garantizar máxima velocidad, conversión y seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">{service.title}</h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/reservas"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-indigo-600 transition-all border border-zinc-700 hover:border-indigo-500"
              >
                <span>Solicitar Servicio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
