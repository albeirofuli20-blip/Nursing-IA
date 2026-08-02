import { useState } from "react";
import { X, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/pae/PatientForm";
import PatientList from "@/components/pae/PatientList";
import StructuredCapture from "@/components/pae/StructuredCapture";

export default function PatientsPanel({ patients, plans, guides, refresh }) {
  const [view, setView] = useState("list");
  const [preselectedPatientId, setPreselectedPatientId] = useState("");

  const startCapture = (patientId) => {
    setPreselectedPatientId(patientId || "");
    setView("capture");
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pacientes y Planes PAE</h2>
          <p className="text-sm text-slate-500">Captura la información del paciente y genera sus PAE en un solo lugar.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView(view === "newPatient" ? "list" : "newPatient")}>
            {view === "newPatient" ? <><X className="mr-1 h-4 w-4" />Cancelar</> : <><UserPlus className="mr-1 h-4 w-4" />Nuevo paciente</>}
          </Button>
          <Button onClick={() => setView(view === "capture" ? "list" : "capture")} className={view === "capture" ? "" : "bg-[#00A8B5] hover:bg-[#008f99]"}>
            {view === "capture" ? <><X className="mr-1 h-4 w-4" />Cerrar captura</> : <><Sparkles className="mr-1 h-4 w-4" />Generar PAE</>}
          </Button>
        </div>
      </div>

      {view === "newPatient" && <PatientForm onSaved={() => { refresh(); setView("list"); }} />}

      {view === "capture" && (
        <>
          <StructuredCapture
            patients={patients}
            guides={guides}
            onSaved={refresh}
            preselectedPatientId={preselectedPatientId}
          />
          <div className="flex justify-center">
            <Button variant="ghost" onClick={() => setView("list")}>Volver a la lista de pacientes</Button>
          </div>
        </>
      )}

      <PatientList
        patients={patients}
        plans={plans}
        onChanged={refresh}
        onGeneratePAE={startCapture}
      />
    </section>
  );
}