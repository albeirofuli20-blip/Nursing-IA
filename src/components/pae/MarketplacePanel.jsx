import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const TYPE_LABELS = { curso: "Curso", plantilla: "Plantilla", protocolo: "Protocolo", caso_clinico: "Caso clínico", recurso: "Recurso" };
const TYPE_COLORS = { curso: "bg-sky-100 text-sky-700", plantilla: "bg-violet-100 text-violet-700", protocolo: "bg-emerald-100 text-emerald-700", caso_clinico: "bg-amber-100 text-amber-700", recurso: "bg-slate-100 text-slate-700" };

export default function MarketplacePanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.MarketplaceItem.filter({ status: "publicado" }).then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = items.filter((i) => (filter === "todos" || i.type === filter) && i.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Marketplace</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Tienda de contenido clínico</h2>
        <p className="mt-2 text-slate-600">Cursos, plantillas, protocolos y casos clínicos creados por expertos verificados.</p>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar en el marketplace..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["todos", "curso", "plantilla", "protocolo", "caso_clinico", "recurso"].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === t ? "bg-[#002D62] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {t === "todos" ? "Todos" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid place-items-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-slate-500">No se encontraron recursos.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[item.type] || TYPE_COLORS.recurso}`}>{TYPE_LABELS[item.type] || "Recurso"}</span>
                {item.rating > 0 && <span className="flex items-center gap-1 text-xs text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-400" />{item.rating}</span>}
              </div>
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600 line-clamp-3">{item.description}</p>
              {item.creator_name && <p className="mt-2 text-xs text-slate-400">Por {item.creator_name}</p>}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[#002D62]">{item.price === 0 ? "Gratis" : `$${item.price}`}</span>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#00A8B5] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#008f99]"><ShoppingCart className="h-4 w-4" />Obtener</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}