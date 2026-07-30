import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Clock, Award, BookOpen, PlayCircle } from "lucide-react";

const LEVEL_LABELS = { basico: "Básico", intermedio: "Intermedio", avanzado: "Avanzado" };
const LEVEL_COLORS = { basico: "bg-emerald-100 text-emerald-700", intermedio: "bg-amber-100 text-amber-700", avanzado: "bg-rose-100 text-rose-700" };

export default function CoursesPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Course.filter({ status: "publicado" }).then((data) => { setCourses(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Aprendizaje</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Cursos y certificaciones</h2>
        <p className="mt-2 text-slate-600">Formación especializada en enfermería con certificados de finalización.</p>
      </div>
      {loading ? (
        <div className="grid place-items-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>
      ) : courses.length === 0 ? (
        <p className="py-20 text-center text-slate-500">Aún no hay cursos publicados.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${LEVEL_COLORS[c.level] || LEVEL_COLORS.basico}`}>{LEVEL_LABELS[c.level] || "Básico"}</span>
                {c.certified && <span className="flex items-center gap-1 text-xs font-semibold text-[#00A8B5]"><Award className="h-3.5 w-3.5" />Certificado</span>}
              </div>
              <h3 className="font-bold text-slate-900">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600 line-clamp-3">{c.description}</p>
              {c.instructor && <p className="mt-2 text-xs text-slate-400">Instructor: {c.instructor}</p>}
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{c.lessons_count || 0} lecciones</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.duration_hours || 0}h</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[#002D62]">{c.price === 0 ? "Gratis" : `$${c.price}`}</span>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#002D62] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#001f4d]"><PlayCircle className="h-4 w-4" />Inscribirse</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}