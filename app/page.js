import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, Shield, Zap, Cpu, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-indigo-400 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ecosistema de Plataforma Digital JSPP.es</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Desarrollo Web & Tecnologías Digitales de{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alto Rendimiento
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Diseñamos y desarrollamos soluciones web optimizadas para máxima conversión, conectadas directamente con la infraestructura inteligente de SPP Labs.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/reservas"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Cita Online</span>
          </Link>
          <Link
            href="/servicios"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span>Explorar Servicios</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">¿Por qué elegir JSPP.es?</h2>
          <p className="text-sm text-zinc-400 mt-2">Tecnología de vanguardia para impulsar tu presencia en línea</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md hover:border-indigo-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Velocidad Extrema</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Construido sobre Next.js App Router y compilado en modo standalone para tiempos de respuesta ultra rápidos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Integración Asistente IA</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Atención automatizada 24/7 mediante nuestro widget conversacional conectado al motor SPP Labs AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md hover:border-pink-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analítica OLAP Cumplimiento GDPR</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Inmunidad analítica y métricas en tiempo real almacenadas de forma anónima en ClickHouse Database.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Booking Teaser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-950 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            ¿Listo para programar una sesión con nosotros?
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto mb-8">
            Selecciona la fecha y hora que mejor se adapte a tu agenda en nuestro calendario interactivo en tiempo real.
          </p>
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Calendar className="w-5 h-5" />
            <span>Ir al Calendario de Reservas</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
