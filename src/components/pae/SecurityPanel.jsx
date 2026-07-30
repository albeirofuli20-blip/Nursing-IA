import { Lock, KeyRound, Fingerprint, ShieldCheck, FileLock2, Eye, AlertTriangle, ScrollText, UserCog } from "lucide-react";

const SECURITY_FEATURES = [
  { icon: Lock, title: "Cifrado en tránsito y reposo", text: "TLS 1.3 para todas las comunicaciones. AES-256 para datos almacenados. Cifrado de backups." },
  { icon: KeyRound, title: "Gestión segura de contraseñas", text: "Hashing con bcrypt/Argon2. Políticas de complejidad. Rotación obligatoria. Sin almacenamiento en texto plano." },
  { icon: Fingerprint, title: "Autenticación multifactor (MFA)", text: "MFA opcional para usuarios y obligatorio para administradores. Soporte TOTP y SMS." },
  { icon: ShieldCheck, title: "Control de acceso basado en roles (RBAC)", text: "Roles: Super Admin, Admin institucional, Docente, Profesional, Estudiante. Permisos granulares por módulo." },
  { icon: ScrollText, title: "Registro de auditoría", text: "Toda acción sensible queda registrada en un log inmutable: accesos, modificaciones, accesos excepcionales." },
  { icon: FileLock2, title: "Prevención de ataques", text: "Protección contra SQL injection, XSS, CSRF, rate limiting, WAF y validación de entrada en todas las capas." }
];

const RBAC_MATRIX = [
  { module: "PAE", estudiante: "Crear/ver propios", docente: "Crear + evaluar", profesional: "Crear + gestionar", admin: "Gestionar institución", super: "Configurar global" },
  { module: "Historia clínica", estudiante: "Ver asignados", docente: "Ver + evaluar", profesional: "Crear + gestionar", admin: "Gestionar institución", super: "—" },
  { module: "Marketplace", estudiante: "Comprar", docente: "Comprar + publicar", profesional: "Comprar + publicar", admin: "Aprobar contenido", super: "Gestionar global" },
  { module: "Usuarios", estudiante: "—", docente: "Ver estudiantes", profesional: "—", admin: "Gestionar institución", super: "Gestionar todos" },
  { module: "Configuración", estudiante: "—", docente: "—", profesional: "—", admin: "Configurar institución", super: "Configurar sistema" }
];

export default function SecurityPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Seguridad y privacidad</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Seguridad y privacidad por diseño</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Estrategia integral de seguridad, control de acceso y privacidad. La información de cada usuario es inviolable por diseño.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECURITY_FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="shrink-0 rounded-xl bg-[#002D62]/10 p-2.5 text-[#002D62]"><Icon className="h-5 w-5" /></div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{f.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
        <h3 className="mb-2 flex items-center gap-2 font-bold text-[#002D62]"><UserCog className="h-5 w-5" />Principio de privacidad del Super Administrador</h3>
        <p className="text-sm text-slate-700">El Super Administrador gestiona la plataforma (usuarios, pagos, contenidos, configuración) pero <strong>no tiene acceso automático al contenido privado de los usuarios</strong>. Cualquier acceso excepcional está restringido, justificado y registrado mediante auditoría inmutable.</p>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Matriz de control de acceso (RBAC)</h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#002D62] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Módulo</th>
              <th className="px-4 py-3 text-left font-semibold">Estudiante</th>
              <th className="px-4 py-3 text-left font-semibold">Docente</th>
              <th className="px-4 py-3 text-left font-semibold">Profesional</th>
              <th className="px-4 py-3 text-left font-semibold">Admin institucional</th>
              <th className="px-4 py-3 text-left font-semibold">Super Admin</th>
            </tr>
          </thead>
          <tbody>
            {RBAC_MATRIX.map((row, i) => (
              <tr key={row.module} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-4 py-3 font-medium text-slate-900">{row.module}</td>
                <td className="px-4 py-3 text-slate-600">{row.estudiante}</td>
                <td className="px-4 py-3 text-slate-600">{row.docente}</td>
                <td className="px-4 py-3 text-slate-600">{row.profesional}</td>
                <td className="px-4 py-3 text-slate-600">{row.admin}</td>
                <td className="px-4 py-3 font-medium text-[#002D62]">{row.super}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <h3 className="text-sm font-bold text-amber-900">IA como apoyo, no sustitución</h3>
          <p className="mt-1 text-sm text-amber-700">Toda recomendación de la IA se etiqueta como propuesta asistida y requiere validación humana. La decisión clínica final corresponde siempre al profesional.</p>
        </div>
      </div>
    </section>
  );
}