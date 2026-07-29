import { LogOut, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ user }) {
  return <header className="border-b border-teal-100 bg-white/90 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3"><div className="rounded-xl bg-teal-700 p-2.5 text-white"><ShieldCheck className="h-5 w-5" /></div><div><h1 className="font-heading text-lg font-bold text-slate-900">PAE Clínico</h1><p className="text-xs text-slate-500">Asistencia para decisiones de enfermería</p></div></div>
      <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-medium text-slate-800">{user?.full_name || user?.email}</p><p className="text-xs capitalize text-teal-700">{user?.role === "admin" ? "Administrador" : "Enfermero/a"}</p></div><Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={() => base44.auth.logout("/login")}><LogOut className="h-4 w-4" /></Button></div>
    </div>
  </header>;
}