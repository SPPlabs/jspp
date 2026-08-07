'use client';

import { useState, useEffect } from 'react';
import { getOccupiedSlots, submitBooking } from '../lib/api';
import { trackAnalyticsEvent } from '../lib/analytics';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '12:00', 
  '14:00', '15:00', '16:00', '17:00'
];

export default function BookingCalendar() {
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Form states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '', bookingId: null });

  // Calculate min and max allowed dates (current month and next calendar month)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Format date as YYYY-MM-DD
  const formatDateStr = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const minDateStr = formatDateStr(now);

  // Max date: last day of next calendar month
  const maxDate = new Date(year, month + 2, 0);
  const maxDateStr = formatDateStr(maxDate);

  // Load occupied slots from API
  useEffect(() => {
    async function loadOccupied() {
      setLoadingSlots(true);
      const res = await getOccupiedSlots();
      if (res.success && Array.isArray(res.occupied)) {
        setOccupiedSlots(res.occupied);
      }
      setLoadingSlots(false);
    }
    loadOccupied();
  }, []);

  // Check if a specific time slot is occupied for the selected date
  const isSlotOccupied = (timeSlot) => {
    if (!selectedDate) return false;
    return occupiedSlots.some(
      (slot) => slot.date === selectedDate && slot.time === timeSlot
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setStatus({
        type: 'error',
        message: 'Por favor, selecciona una fecha y una hora disponibles.',
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: '' });

    const payload = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
    };

    const res = await submitBooking(payload);
    setSubmitting(false);

    if (res.success) {
      setStatus({
        type: 'success',
        message: res.message || 'Cita reservada correctamente.',
        bookingId: res.id,
      });

      // Update local occupied slots so user sees their new booking instantly
      setOccupiedSlots((prev) => [...prev, { date: selectedDate, time: selectedTime }]);

      // Track ClickHouse Analytics Conversion (Spec 03)
      trackAnalyticsEvent('booking_conversion', {
        booking_id: res.id || '',
        conversion: true,
      });

      // Reset form fields
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSelectedTime('');
    } else {
      let errorMsg = res.message || 'No se pudo completar la reserva.';
      if (res.status === 429) {
        errorMsg = 'Has enviado demasiadas solicitudes. Por favor, espera un momento.';
      }
      setStatus({
        type: 'error',
        message: errorMsg,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-2xl">
      {status.type === 'success' && (
        <div className="mb-6 p-5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base text-emerald-300">¡Reserva Confirmada!</h4>
            <p className="mt-1">{status.message}</p>
            {status.bookingId && (
              <p className="mt-2 text-xs font-mono text-emerald-400 bg-emerald-900/50 p-2 rounded border border-emerald-800/60 inline-block">
                ID Cita: {status.bookingId}
              </p>
            )}
          </div>
        </div>
      )}

      {status.type === 'error' && (
        <div className="mb-6 p-5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base text-red-300">Error en la Reserva</h4>
            <p className="mt-1">{status.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Select Date & Time */}
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>1. Selecciona Fecha</span>
            </label>
            <p className="text-xs text-zinc-400 mb-3">
              Permitido hasta el último día del próximo mes.
            </p>
            <input
              type="date"
              required
              min={minDateStr}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
              }}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>2. Selecciona Horario</span>
            </label>
            
            {!selectedDate ? (
              <p className="text-xs text-zinc-500 italic p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                Selecciona primero una fecha para consultar horarios.
              </p>
            ) : loadingSlots ? (
              <div className="flex items-center justify-center p-6 text-xs text-zinc-400 gap-2 bg-zinc-950 rounded-xl border border-zinc-800">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Consultando disponibilidad en SPP Labs API...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AVAILABLE_TIMES.map((time) => {
                  const occupied = isSlotOccupied(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      type="button"
                      key={time}
                      disabled={occupied}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        occupied
                          ? 'bg-zinc-950 text-zinc-600 border-zinc-900 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-indigo-500 hover:text-white'
                      }`}
                    >
                      {time} {occupied && '(Ocupado)'}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Contact Info */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              3. Datos del Solicitante
            </h3>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Sarah Connor"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@ejemplo.com"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Teléfono Móvil *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+34699887766"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Notas de la Cita</label>
              <textarea
                rows="2"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Motivo de la consulta o comentarios..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-sm text-white placeholder-zinc-600 focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedDate || !selectedTime}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirmando Reserva...</span>
              </>
            ) : (
              <span>Confirmar Reserva de Cita</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
