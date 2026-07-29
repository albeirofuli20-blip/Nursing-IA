import { LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

const LOGO_URL = "https://media.base44.com/images/public/6a69925ce406f647a282e3d2/1470e3e2f_WhatsAppImage2026-07-29at13131AM.jpg";

export default function DashboardHeader({ user }) {
  return <header className="border-b border-[#00A8B5]/20 bg-[#002D62]">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="overflow-hidden rounded-xl bg-white p-1 w-11 h-11">
          <Image src={LOGO_URL} alt="Nurse Master IA" fittingType="fit" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-white">Nurse Master <span className="rounded-md bg-[#00A8B5] px-1.5 py-0.5 text-sm">IA</span></h1>
          <p className="text-xs text-white/70">Tu copiloto inteligente para el PAE</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{user?.full_name || user?.email}</p>
          <p className="text-xs capitalize text-[#00A8B5]">{user?.role === "admin" ? "Administrador" : "Enfermero/a"}</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Cerrar sesión" className="text-white hover:bg-white/10" onClick={() => base44.auth.logout("/login")}><LogOut className="h-4 w-4" /></Button>
      </div>
    </div>
  </header>;
}