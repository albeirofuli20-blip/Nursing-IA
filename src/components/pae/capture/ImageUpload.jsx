import { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Label } from "@/components/ui/label";

export function ImageUpload({ label, images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        files.map((file) => base44.integrations.Core.UploadFile({ file }))
      );
      const newUrls = uploaded.map((r) => r.file_url).filter(Boolean);
      onChange([...images, ...newUrls]);
    } catch {
      setError("No se pudieron subir las imágenes.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <div className="mt-1 space-y-2">
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((url, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-lg border border-slate-200">
                <Image src={url} alt={`Imagen ${idx + 1}`} className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 hover:border-[#00A8B5] hover:text-[#00A8B5]">
          {uploading ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Subiendo imágenes...</>
          ) : (
            <><Upload className="h-4 w-4" />Subir imágenes clínicas</>
          )}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {images.length > 0 && (
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <ImageIcon className="h-3 w-3" />{images.length} imagen(es) cargada(s) — la IA las analizará para mejorar el diagnóstico.
          </p>
        )}
      </div>
    </div>
  );
}