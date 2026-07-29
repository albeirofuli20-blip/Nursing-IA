import { useState } from "react";
import { Button } from "@/components/ui/button";
import GuideForm from "@/components/pae/GuideForm";
import GuideList from "@/components/pae/GuideList";
import WebGuideSearch from "@/components/pae/WebGuideSearch";

export default function GuidesPanel({ guides, user, refresh }) {
  const [adding, setAdding] = useState(false); const admin = user?.role === "admin";
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900">Guías y protocolos</h2><p className="text-sm text-slate-500">Biblioteca clínica con fuentes verificables.</p></div>{admin && <Button variant="outline" onClick={() => setAdding(!adding)}>{adding ? "Cerrar" : "Cargar guía"}</Button>}</div>{admin && adding && <GuideForm onSaved={() => { refresh(); setAdding(false); }} />}{admin && <WebGuideSearch onSaved={refresh} />}<GuideList guides={guides} /></section>;
}