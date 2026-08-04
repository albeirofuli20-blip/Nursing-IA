import { useState } from "react";
import { UserPlus, Shield, GraduationCap, Stethoscope, Building2, BookOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PROFESSIONAL_ROLES = [
  { value: "enfermero", label: "Enfermero/a", icon: Stethoscope, color: "bg-teal-100 text-teal-700" },
  { value: "docente", label: "Docente", icon: BookOpen, color: "bg-indigo-100 text-indigo-700" },
  { value: "estudiante", label: "Estudiante", icon: GraduationCap, color: "bg-sky-100 text-sky-700" },
  { value: "institucion", label: "Institución", icon: Building2, color: "bg-violet-100 text-violet-700" },
  { value: "administrador", label: "Administrador", icon: Shield, color: "bg-rose-100 text-rose-700" }
];

const SUBSCRIPTION_PLANS = [
  { value: "gratuito", label: "Gratuito" },
  { value: "premium", label: "Premium" },
  { value: "universidades", label: "Universidades" },
  { value: "hospitales", label: "Hospitales" }
];

export default function UsersPanel({ users, refresh }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function invite(e) {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      await base44.users.inviteUser(email, role);
      setEmail("");
      setMessage("Invitación enviada correctamente.");
      refresh();
    } catch {
      setMessage("No se pudo enviar la invitación.");
    } finally {
      setSending(false);
    }
  }

  async function updateProfessionalRole(userId, newRole) {
    try {
      await base44.entities.User.update(userId, { professional_role: newRole });
      refresh();
    } catch { /* error */ }
  }

  async function updateSubscription(userId, plan) {
    try {
      await base44.entities.User.update(userId, { subscription_plan: plan });
      refresh();
    } catch { /* error */ }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">Usuarios y roles</h2>
        <p className="text-sm text-slate-500">Invita profesionales, docentes, estudiantes e instituciones. Controla permisos y planes de suscripción.</p>
      </div>

      <form onSubmit={invite} className="mb-5 flex flex-col gap-2 rounded-xl bg-teal-50 p-4 sm:flex-row">
        <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@institucion.com" />
        <select className="h-10 rounded-md border bg-white px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Usuario (estándar)</option>
          <option value="admin">Administrador</option>
        </select>
        <Button disabled={sending} className="bg-teal-700 hover:bg-teal-800">
          <UserPlus className="mr-2 h-4 w-4" />{sending ? "Enviando…" : "Invitar"}
        </Button>
      </form>

      {message && <p className="mb-3 text-sm text-slate-600">{message}</p>}

      <div className="divide-y">
        {users.map((user) => {
          const profRole = PROFESSIONAL_ROLES.find((r) => r.value === user.professional_role) || PROFESSIONAL_ROLES[0];
          const RoleIcon = profRole.icon;
          return (
            <div key={user.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${profRole.color}`}><RoleIcon className="h-4 w-4" /></div>
                <div>
                  <p className="font-medium text-slate-900">{user.full_name || "Usuario invitado"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  {user.institution_name && <p className="text-xs text-slate-400">{user.institution_name}</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {user.role === "admin" && <Badge className="bg-rose-100 text-rose-700">Admin sistema</Badge>}
                <select
                  className="h-8 rounded-md border bg-white px-2 text-xs"
                  value={user.professional_role || "enfermero"}
                  onChange={(e) => updateProfessionalRole(user.id, e.target.value)}
                >
                  {PROFESSIONAL_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <select
                  className="h-8 rounded-md border bg-white px-2 text-xs"
                  value={user.subscription_plan || "gratuito"}
                  onChange={(e) => updateSubscription(user.id, e.target.value)}
                >
                  {SUBSCRIPTION_PLANS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}