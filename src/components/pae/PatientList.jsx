import { Trash2, UserRound, Sparkles, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import PlanCard from "@/components/pae/PlanCard";

export default function PatientList({ patients, plans, onChanged, onGeneratePAE }) {
  if (!patients.length) return <div className="py-10 text-center text-sm text-slate-500">Aún no hay pacientes registrados. Crea un paciente o usa "Generar PAE" para comenzar la captura estructurada.</div>;
  return (
    <div className="space-y-4">
      {patients.map((patient) => {
        const patientPlans = plans.filter((p) => p.patient_id === patient.id);
        return (
          <div key={patient.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-600"><UserRound className="h-4 w-4" /></div>
                <div>
                  <p className="font-semibold text-slate-900">{patient.full_name}</p>
                  <p className="text-xs text-slate-500">{patient.code} · {patient.birth_date || "Sin fecha de nacimiento"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{patient.clinical_summary || "Sin valoración clínica"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onGeneratePAE(patient.id)} className="bg-[#00A8B5] hover:bg-[#008f99]">
                  <Sparkles className="mr-1 h-3 w-3" />Generar PAE
                </Button>
                <Button variant="ghost" size="icon" aria-label="Eliminar paciente" onClick={async () => { if (window.confirm("¿Eliminar este paciente?")) { await base44.entities.Patient.delete(patient.id); onChanged(); } }}>
                  <Trash2 className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </div>
            {patientPlans.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400"><FileText className="h-3.5 w-3.5" />Planes PAE ({patientPlans.length})</p>
                <div className="grid gap-3 lg:grid-cols-2">
                  {patientPlans.map((plan) => <PlanCard key={plan.id} plan={plan} onChanged={onChanged} />)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}