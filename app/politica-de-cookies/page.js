import { Cookie, Database, HardDrive, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Política de Cookies y Almacenamiento — JSPP.es',
  description: 'Inventario detallado de cookies y almacenamiento local de la plataforma JSPP.es conforme a Spec 03.',
};

export default function PoliticaCookiesPage() {
  const cookieInventory = [
    {
      storageType: 'Cookie',
      key: 'spp_visitor_id',
      purpose: 'Identificador persistente de visitante UUID v4 (365 días).',
      classification: 'Analítica (Requiere Banner)',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      storageType: 'Cookie',
      key: 'spp_session_id',
      purpose: 'Identificador de sesión activa UUID v4 (30 minutos).',
      classification: 'Analítica (Requiere Banner)',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      storageType: 'Cookie',
      key: 'spp_session',
      purpose: 'Token JWT de sesión de cliente (24 horas).',
      classification: 'Estrictamente Necesaria (Exenta)',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      storageType: 'LocalStorage',
      key: 'spp_lang',
      purpose: 'Preferencia de idioma seleccionado (es / en).',
      classification: 'Funcional',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      storageType: 'LocalStorage',
      key: 'spp_theme',
      purpose: 'Preferencia de tema de interfaz (light / dark).',
      classification: 'Funcional',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      storageType: 'SessionStorage',
      key: 'spp_chatbot_conversation_session',
      purpose: 'Histórico activo de conversación del Asistente de IA durante la navegación.',
      classification: 'Funcional',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-zinc-300">
      <div className="border-b border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Cookie className="w-4 h-4" />
          <span>Inventario de Almacenamiento Web</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Política de Cookies & Almacenamiento Web</h1>
        <p className="text-sm text-zinc-400">
          Inventario técnico completo de cookies, LocalStorage y SessionStorage utilizados en <strong className="text-zinc-200">jspp.es</strong> según la especificación SPP Labs Client State.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-800">
            <tr>
              <th className="py-4 px-4 sm:px-6">Tipo</th>
              <th className="py-4 px-4 sm:px-6">Clave / Nombre</th>
              <th className="py-4 px-4 sm:px-6">Propósito y Expiración</th>
              <th className="py-4 px-4 sm:px-6">Clasificación Legal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {cookieInventory.map((item, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-4 px-4 sm:px-6 font-semibold text-white">
                  <span className="inline-flex items-center gap-1.5 font-sans">
                    {item.storageType === 'Cookie' ? (
                      <Cookie className="w-3.5 h-3.5 text-indigo-400" />
                    ) : item.storageType === 'LocalStorage' ? (
                      <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <Database className="w-3.5 h-3.5 text-pink-400" />
                    )}
                    {item.storageType}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6 text-indigo-300 font-bold">{item.key}</td>
                <td className="py-4 px-4 sm:px-6 text-zinc-300 font-sans">{item.purpose}</td>
                <td className="py-4 px-4 sm:px-6 font-sans">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium border ${item.badgeColor}`}>
                    {item.classification}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
        <h3 className="text-sm font-semibold text-white mb-2">Gestión de Preferencias</h3>
        <p>
          Puedes modificar o revocar el consentimiento del uso de cookies no esenciales en cualquier momento limpiando el almacenamiento local de tu navegador o restableciendo tus opciones a través de nuestro banner flotante de privacidad.
        </p>
      </div>
    </div>
  );
}
