export default function DetailSection({ title, children }) {
  if (!children) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#00A8B5]">{title}</p>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}