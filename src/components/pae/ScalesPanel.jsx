import { useState } from "react";
import { SCALES } from "@/lib/scales";
import ScaleCalculator from "@/components/pae/ScaleCalculator";

export default function ScalesPanel() {
  const [active, setActive] = useState("glasgow"); const keys = Object.keys(SCALES);
  return <section className="space-y-4"><div><h2 className="text-xl font-bold text-slate-900">Escalas clínicas</h2><p className="text-sm text-slate-500">Cálculo automático e interpretación.</p></div><div className="flex flex-wrap gap-2">{keys.map(key => <button key={key} onClick={() => setActive(key)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === key ? "bg-teal-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300"}`}>{SCALES[key].name}</button>)}</div><ScaleCalculator scaleKey={active} /></section>;
}