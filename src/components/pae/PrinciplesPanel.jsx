import { ShieldCheck, Lock, Sparkles, BookCheck, Eye, Scale, HeartHandshake, Globe, Crown } from "lucide-react";

const PRINCIPLES = [
  { icon: Lock, title: "Privacidad por diseño", text: "La información de cada usuario es privada. Cada usuario solo visualiza la información que él mismo crea. El aislamiento de datos es un principio arquitectónico, no una configuración opcional." },
  { icon: Crown, title: "Super Administrador único", text: "El propietario de la plataforma es el único Super Administrador. Administra usuarios, planes, pagos, contenidos y configuraciones globales." },
  { icon: Eye, title: "Acceso excepcional con auditoría", text: "El Super Administrador no accede automáticamente al contenido privado de los usuarios. Cualquier acceso excepcional está restringido, justificado y registrado mediante auditoría." },
  { icon: Sparkles, title: "IA como apoyo, no sustitución", text: "La IA apoya el razonamiento clínico sin sustituir la decisión del profesional. Toda sugerencia se etiqueta como propuesta asistida y requiere validación humana." },
  { icon: BookCheck, title: "Evidencia científica", text: "La plataforma está basada en evidencia científica. Las recomendaciones se sustentan en taxonomías validadas y guías curadas, con actualización periódica." },
  { icon: Scale, title: "Transparencia", text: "La plataforma informa claramente sobre las capacidades y limitaciones de la IA, el uso de los datos y los derechos del usuario." },
  { icon: HeartHandshake, title: "Equidad de acceso", text: "La plataforma mantiene un plan gratuito funcional para garantizar el acceso a herramientas de calidad a todos los segmentos." },
  { icon: Globe, title: "Contexto regional", text: "Diseñada nativamente para el contexto latinoamericano de enfermería, con taxonomías y formatos locales." }
];

export default function PrinciplesPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Gobernanza y ética</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Principios del sistema</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Los principios fundamentales que rigen Nurse Master IA, garantizando privacidad, ética y calidad clínica.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="shrink-0 rounded-xl bg-[#002D62]/10 p-3 text-[#002D62]"><Icon className="h-5 w-5" /></div>
              <div>
                <h3 className="font-bold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{p.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#002D62] p-5 text-white">
        <ShieldCheck className="h-8 w-8 shrink-0 text-[#00A8B5]" />
        <p className="text-sm">Nurse Master IA cumple con principios de protección de datos y ética en salud digital. La privacidad del usuario es inviolable por diseño.</p>
      </div>
    </section>
  );
}