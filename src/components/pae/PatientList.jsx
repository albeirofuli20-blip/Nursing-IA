import { Trash2, UserRound } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function PatientList({ patients, onChanged }) {
  if (!patients.length) return <div className="py-10 text-center text-sm text-slate-500">Aún no hay pacientes registrados.</div>;
  return <div className="divide-y divide-slate-100">{patients.map(patient => <div key={patient.id} className="flex items-start justify-between gap-4 py-4"><div className="flex gap-3"><div className="rounded-xl bg-slate-100 p-2 text-slate-600"><UserRound className="h-4 w-4" /></div><div><p className="font-semibold text-slate-900">{patient.full_name}</p><p className="text-xs text-slate-500">{patient.code} · {patient.birth_date || "Sin fecha de nacimiento"}</p><p className="mt-1 line-clamp-2 text-sm text-slate-600">{patient.clinical_summary || "Sin valoración clínica"}</p></div></div><Button variant="ghost" size="icon" aria-label="Eliminar paciente" onClick={async () => { if (window.confirm("¿Eliminar este paciente?")) { await base44.entities.Patient.delete(patient.id); onChanged(); } }}><Trash2 className="h-4 w-4 text-slate-400" /></Button></div>)}</div>;
}