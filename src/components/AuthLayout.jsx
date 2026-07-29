import React from "react";
import { Image } from "@/components/ui/image";

const LOGO_URL = "https://media.base44.com/images/public/6a69925ce406f647a282e3d2/1470e3e2f_WhatsAppImage2026-07-29at13131AM.jpg";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002D62] via-[#003d7a] to-[#00A8B5] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-lg w-28 h-28">
              <Image src={LOGO_URL} alt="Nurse Master IA" fittingType="fit" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Nurse Master <span className="rounded-lg bg-[#00A8B5] px-2 py-0.5 text-white">IA</span></h1>
          <p className="text-sm text-white/80 mt-2 max-w-xs mx-auto leading-snug">Tu copiloto inteligente para dominar el Proceso de Atención de Enfermería</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
          {subtitle && <p className="text-slate-500 text-sm mb-6">{subtitle}</p>}
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-white/80 mt-6">{footer}</p>
        )}
        <div className="mt-6 rounded-lg bg-[#002D62] px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white">Aprende • Aplica • Analiza • Evoluciona</div>
      </div>
    </div>
  );
}