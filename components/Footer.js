import Link from 'next/link';
import { Sparkles, ShieldCheck, Cookie, FileText, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Company Info */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">JSPP<span className="text-indigo-400">.es</span></span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Soluciones digitales de alto rendimiento impulsadas por la arquitectura e infraestructura de SPP Labs Ecosystem.
          </p>
          <div className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} JSPP.es. Todos los derechos reservados.
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">Navegación</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-indigo-400 transition-colors">Inicio</Link>
            </li>
            <li>
              <Link href="/servicios" className="hover:text-indigo-400 transition-colors">Nuestros Servicios</Link>
            </li>
            <li>
              <Link href="/reservas" className="hover:text-indigo-400 transition-colors">Reservas Online</Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-indigo-400 transition-colors">Formulario de Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Legal Links - Mandatory Specs */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">Información Legal</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/politica-de-privacidad" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                <span>Política de Privacidad</span>
              </Link>
            </li>
            <li>
              <Link href="/politica-de-cookies" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <Cookie className="w-3.5 h-3.5 text-zinc-500" />
                <span>Política de Cookies</span>
              </Link>
            </li>
            <li>
              <Link href="/terminos-y-condiciones" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <span>Términos y Condiciones</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Integration Specs */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">Tecnología</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Conectado mediante API segura al backend centralizado y motor de analítica OLAP ClickHouse.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SPP Labs API v1 Ready</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900 text-center text-xs text-zinc-600">
        Dominio Registrado: <span className="text-zinc-400">jspp.es</span> &bull; API Gateway: <span className="text-zinc-400">https://api.spplabs.es</span>
      </div>
    </footer>
  );
}
