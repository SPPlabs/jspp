'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, PhoneCall, Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Reservas', href: '/reservas' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            JSPP<span className="text-indigo-400">.es</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Cita</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                pathname === link.href
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/reservas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Reservar Cita</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
