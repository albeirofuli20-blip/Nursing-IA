import PlanCard from "@/components/pae/PlanCard";
import PlanGenerator from "@/components/pae/PlanGenerator";

export default function PlansPanel({ plans, patients, guides, refresh }) {
  return <section className="space-y-4"><div><h2 className="text-xl font-bold text-slate-900">Planes de atención</h2><p className="text-sm text-slate-500">Genera un borrador, revísalo y controla su estado.</p></div><PlanGenerator patients={patients} guides={guides} onSaved={refresh} />{plans.length ? <div className="grid gap-4 lg:grid-cols-2">{plans.map(plan => <PlanCard key={plan.id} plan={plan} onChanged={refresh} />)}</div> : <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">Aún no hay planes de atención.</div>}</section>;
}