import { Bell, BellOff, Check, Clock, AlertCircle, GraduationCap, Pill, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NOTIFICATIONS = [
  { type: "clinical", icon: AlertCircle, title: "Recordatorio: Administrar medicación", text: "Paracetamol 1g IV al paciente P-003 en 15 minutos", time: "Hace 5 min", read: false, color: "text-red-600 bg-red-50" },
  { type: "academic", icon: GraduationCap, title: "Nueva evaluación disponible", text: "El docente ha calificado tu PAE sobre paciente postoperatorio", time: "Hace 1 h", read: false, color: "text-purple-600 bg-purple-50" },
  { type: "reminder", icon: Clock, title: "PAE pendiente de actualización", text: "El plan de cuidado del paciente P-001 requiere evaluación semanal", time: "Hace 3 h", read: false, color: "text-amber-600 bg-amber-50" },
  { type: "system", icon: FileText, title: "Nueva guía clínica publicada", text: "Protocolo actualizado de prevención de úlceras por presión", time: "Hace 1 día", read: true, color: "text-sky-600 bg-sky-50" },
  { type: "clinical", icon: Pill, title: "Alerta de interacción medicamentosa", text: "Se detectó posible interacción entre enoxaparina y AINEs", time: "Hace 1 día", read: true, color: "text-red-600 bg-red-50" },
  { type: "system", icon: Bell, title: "Bienvenida a Nurse Master IA", text: "Completa tu perfil para personalizar tu experiencia", time: "Hace 3 días", read: true, color: "text-slate-600 bg-slate-50" }
];

export default function NotificationsPanel() {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 18</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Notificaciones</h2>
          <p className="mt-2 text-slate-600">Recordatorios, alertas clínicas, avisos académicos y actualizaciones del sistema.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#002D62] px-4 py-2 text-white"><Bell className="h-4 w-4" /><span className="text-sm font-bold">{unread} sin leer</span></div>
      </div>
      <div className="space-y-2">
        {NOTIFICATIONS.map((n, i) => {
          const Icon = n.icon;
          return (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${n.read ? "border-slate-200 bg-white" : "border-[#00A8B5]/30 bg-[#00A8B5]/5"}`}>
              <div className={`shrink-0 rounded-lg p-2 ${n.color}`}><Icon className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  <span className="text-xs text-slate-400">{n.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{n.text}</p>
              </div>
              {!n.read && <Badge className="bg-[#00A8B5] text-white">Nuevo</Badge>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">¿Deseas silenciar todas las notificaciones temporalmente?</p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><BellOff className="h-4 w-4" />Silenciar</button>
      </div>
    </section>
  );
}