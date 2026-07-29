import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/pae/PatientForm";
import PatientList from "@/components/pae/PatientList";

export default function PatientsPanel({ patients, refresh }) {
  const [open, setOpen] = useState(false);
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900">Pacientes</h2><p className="text-sm text-slate-500">Datos de valoración bajo acceso restringido.</p></div><Button onClick={() => setOpen(!open)} variant={open ? "outline" : "default"} className={open ? "" : "bg-teal-700 hover:bg-teal-800"}>{open ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}{open ? "Cerrar" : "Nuevo"}</Button></div>{open && <div className="mb-4"><PatientForm onSaved={() => { refresh(); setOpen(false); }} /></div>}<PatientList patients={patients} onChanged={refresh} /></section>;
}