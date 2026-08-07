'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie selection
    const consent = localStorage.getItem('spp_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('spp_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('spp_cookie_consent', 'essential_only');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 p-5 rounded-2xl bg-zinc-900/95 border border-zinc-800 backdrop-blur-xl shadow-2xl text-zinc-200 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Preferencias de Privacidad y Cookies</h3>
            <button
              onClick={handleReject}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Utilizamos cookies técnicas y analíticas (<code className="text-indigo-300">spp_visitor_id</code>, <code className="text-indigo-300">spp_session_id</code>) para optimizar la experiencia de navegación en <span className="text-zinc-200">jspp.es</span>.
          </p>
          <div className="text-xs pt-1">
            <Link href="/politica-de-cookies" className="text-indigo-400 hover:underline font-medium">
              Ver inventario completo de almacenamiento &rarr;
            </Link>
          </div>
          <div className="flex items-center gap-2 pt-3">
            <button
              onClick={handleAccept}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              Aceptar Todas
            </button>
            <button
              onClick={handleReject}
              className="py-2 px-3 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all"
            >
              Solo Necesarias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
