import { useState } from "react";
import { ListChecks, Sparkles } from "lucide-react";
import PlanCard from "@/components/pae/PlanCard";
import PlanGenerator from "@/components/pae/PlanGenerator";
import StructuredCapture from "@/components/pae/StructuredCapture";

export default function PlansPanel({ plans, patients, guides, refresh }) {
  const [mode, setMode] = useState("structured");
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Planes de atención</h2>
        <p className="text-sm text-slate-500">Genera PAE asistidos por IA, revísalos y controla su estado.</p>
      </div>
      <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
        <button onClick={() => setMode("structured")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${mode === "structured" ? "bg-[#002D62] text-white" : "text-slate-600"}`}>
          <ListChecks className="h-4 w-4" />Captura estructurada
        </button>
        <button onClick={() => setMode("quick")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${mode === "quick" ? "bg-[#002D62] text-white" : "text-slate-600"}`}>
          <Sparkles className="h-4 w-4" />Generador rápido
        </button>
      </div>
      {mode === "structured"
        ? <StructuredCapture patients={patients} guides={guides} onSaved={refresh} />
        : <PlanGenerator patients={patients} guides={guides} onSaved={refresh} />}
      {plans.length
        ? <div className="grid gap-4 lg:grid-cols-2">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} onChanged={refresh} />)}</div>
        : <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">Aún no hay planes de atención.</div>}
    </section>
  );
}