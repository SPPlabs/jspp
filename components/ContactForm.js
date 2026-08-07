'use client';

import { useState } from 'react';
import { submitContactForm } from '../lib/api';
import { trackAnalyticsEvent } from '../lib/analytics';
import { Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    // Validate fields
    if (!formData.name || !formData.email || !formData.message) {
      setLoading(false);
      setStatus({
        type: 'error',
        message: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }

    const response = await submitContactForm(formData);
    setLoading(false);

    if (response.success) {
      setStatus({
        type: 'success',
        message: response.message || 'Mensaje enviado correctamente. Nos pondremos en contacto contigo lo antes posible.',
      });
      
      // Track conversion in ClickHouse Analytics (Spec 03)
      trackAnalyticsEvent('form_submit', {
        form_name: 'contact_form',
        conversion: true,
      });

      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      // Handle rate limit (429) or other errors gracefully
      let userMsg = response.message || 'Ha ocurrido un error al enviar el formulario.';
      if (response.status === 429) {
        userMsg = 'Has enviado demasiados mensajes. Por favor, espera un momento antes de volver a intentarlo.';
      }
      
      setStatus({
        type: 'error',
        message: userMsg,
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status Messages */}
        {status.type === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">¡Solicitud Procesada!</p>
              <p className="mt-0.5 text-emerald-300/90">{status.message}</p>
            </div>
          </div>
        )}

        {status.type === 'error' && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error al enviar</p>
              <p className="mt-0.5 text-red-300/90">{status.message}</p>
            </div>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Nombre Completo <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Alex Smith"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all disabled:opacity-50"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Correo Electrónico <span className="text-indigo-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@ejemplo.com"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+34612345678"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Mensaje <span className="text-indigo-400">*</span>
          </label>
          <textarea
            name="message"
            rows="4"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Escribe aquí tu consulta o requerimiento..."
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all disabled:opacity-50 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Enviando información...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar Formulario</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
