import { Link } from "react-router-dom";
import { LogOut, ShieldAlert, LayoutGrid } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

const LOGO_URL = "https://media.base44.com/images/public/6a69925ce406f647a282e3d2/1470e3e2f_WhatsAppImage2026-07-29at13131AM.jpg";

export default function SivigilaHeader({ user }) {
  const rol = user?.role === "admin" ? "Administrador" : user?.sivigila_rol === "notificador" ? "Notificador" : "Coordinador";
  return (
    <header className="border-b border-[#00A8B5]/20 bg-[#002D62]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-xl bg-white p-1">
            <Image src={LOGO_URL} alt="SIVIDENGUE" fittingType="fit" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-white">
              SIVI<span className="rounded-md bg-[#00A8B5] px-1.5 py-0.5 text-sm">DENGUE</span>
            </h1>
            <p className="text-xs text-white/70">Notificación y seguimiento de dengue · SIVIGILA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{user?.full_name || user?.email}</p>
            <p className="text-xs text-[#00A8B5]">
              {rol}
              {user?.sivigila_municipio ? ` · ${user.sivigila_municipio}` : ""}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link to="/panel"><LayoutGrid className="mr-1.5 h-4 w-4" />Módulo clínico</Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cerrar sesión" className="text-white hover:bg-white/10" onClick={() => base44.auth.logout("/login")}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 pb-2 sm:px-6">
        <ShieldAlert className="h-3.5 w-3.5 text-[#00A8B5]" />
        <p className="text-[11px] text-white/60">Eventos 210 · 220 · 580 — INS Colombia</p>
      </div>
    </header>
  );
}