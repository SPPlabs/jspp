import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import ChatbotWidget from '../components/ChatbotWidget';
import Script from 'next/script';

export const metadata = {
  title: 'JSPP.es — Soluciones Digitales y Desarrollo Web Premium',
  description: 'Sitio oficial de JSPP.es. Soluciones tecnológicas avanzadas, reservas en línea e integración con la plataforma de alto rendimiento SPP Labs.',
  keywords: ['JSPP', 'desarrollo web', 'reservas online', 'nextjs', 'spp labs'],
};

export default function RootLayout({ children }) {
  const domain = process.env.NEXT_PUBLIC_SPPLABS_DOMAIN || 'jspp.es';

  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between antialiased selection:bg-indigo-500 selection:text-white">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>

        <Footer />
        <CookieBanner />
        <ChatbotWidget />

        {/* Mandatory SPP Labs Analytics Tracker Script (Spec 03) */}
        <Script
          src="https://api.spplabs.es/tracker.js"
          data-website-domain={domain}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
