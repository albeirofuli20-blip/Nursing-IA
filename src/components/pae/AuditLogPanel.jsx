import { useState, useEffect } from "react";
import { Shield, Search, Activity } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ACTION_LABELS = {
  login: { label: "Inicio de sesión", color: "bg-sky-100 text-sky-700" },
  logout: { label: "Cierre de sesión", color: "bg-slate-100 text-slate-600" },
  create_patient: { label: "Paciente creado", color: "bg-emerald-100 text-emerald-700" },
  update_patient: { label: "Paciente actualizado", color: "bg-amber-100 text-amber-700" },
  delete_patient: { label: "Paciente eliminado", color: "bg-red-100 text-red-700" },
  create_pae: { label: "PAE creado", color: "bg-violet-100 text-violet-700" },
  update_pae: { label: "PAE actualizado", color: "bg-amber-100 text-amber-700" },
  delete_pae: { label: "PAE eliminado", color: "bg-red-100 text-red-700" },
  ai_generate: { label: "Generación IA", color: "bg-teal-100 text-teal-700" },
  ai_chat: { label: "Chat IA", color: "bg-cyan-100 text-cyan-700" },
  config_change: { label: "Cambio de config", color: "bg-rose-100 text-rose-700" },
  user_invite: { label: "Usuario invitado", color: "bg-indigo-100 text-indigo-700" },
  export_data: { label: "Exportación", color: "bg-orange-100 text-orange-700" },
  role_change: { label: "Cambio de rol", color: "bg-red-100 text-red-700" }
};

export default function AuditLogPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await base44.entities.AuditLog.list("-created_date", 100);
      setLogs(data);
    } catch { setLogs([]); }
    finally { setLoading(false); }
  }

  const filtered = logs.filter((l) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (l.description || "").toLowerCase().includes(q) || (l.user_email || "").toLowerCase().includes(q) || (l.action || "").toLowerCase().includes(q);
  });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Seguridad y cumplimiento</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Historial de auditoría</h2>
        <p className="mt-2 text-slate-600">Registro inmutable de todas las operaciones sensibles realizadas en la plataforma.</p>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Buscar por acción, usuario o descripción..." className="pl-9" />
      </div>

      {loading ? (
        <p className="p-8 text-center text-slate-400">Cargando registros...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Activity className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-400">No hay registros de auditoría.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#002D62] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold">Acción</th>
                <th className="px-4 py-3 text-left font-semibold">Descripción</th>
                <th className="px-4 py-3 text-left font-semibold">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const meta = ACTION_LABELS[log.action] || { label: log.action, color: "bg-slate-100 text-slate-600" };
                return (
                  <tr key={log.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{new Date(log.created_date).toLocaleString("es-CO")}</td>
                    <td className="px-4 py-3"><Badge className={meta.color}>{meta.label}</Badge></td>
                    <td className="px-4 py-3 text-slate-700">{log.description}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{log.user_email || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}