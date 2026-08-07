import BookingCalendar from '../../components/BookingCalendar';

export const metadata = {
  title: 'Reserva de Citas — JSPP.es',
  description: 'Reserva tu cita online en tiempo real. Calendario interactivo integrado con SPP Labs API.',
};

export default function ReservasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Reserva de <span className="text-indigo-400">Citas Online</span>
        </h1>
        <p className="text-sm text-zinc-400">
          Consulta la disponibilidad en tiempo real y reserva tu franja horaria. Los huecos ocupados se deshabilitan automáticamente.
        </p>
      </div>

      <BookingCalendar />
    </div>
  );
}
