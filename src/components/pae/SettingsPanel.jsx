import { useEffect, useState } from "react";
import { Moon, Sun, Type, Globe, Bell, Shield, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function SettingsPanel() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("mediano");
  const [language, setLanguage] = useState("es");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark"); else root.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const sizes = { pequeno: "14px", mediano: "16px", grande: "18px" };
    root.style.fontSize = sizes[fontSize] || "16px";
  }, [fontSize]);

  return (
    <section className="max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Personalización</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Ajustes y preferencias</h2>
        <p className="mt-2 text-slate-600">Configura la apariencia, el idioma y las notificaciones según tus preferencias.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-[#002D62]"><Palette className="h-5 w-5" />Apariencia</h3>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-slate-600" /> : <Sun className="h-5 w-5 text-amber-500" />}
              <div><Label>Modo oscuro</Label><p className="text-xs text-slate-500">Reduce la fatiga visual en entornos de poca luz.</p></div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-slate-600" />
              <div><Label>Tamaño de texto</Label><p className="text-xs text-slate-500">Ajusta el tamaño para mejor legibilidad.</p></div>
            </div>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pequeno">Pequeño</SelectItem>
                <SelectItem value="mediano">Mediano</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-[#002D62]"><Globe className="h-5 w-5" />Idioma</h3>
          <div className="flex items-center justify-between py-2">
            <div><Label>Idioma de la interfaz</Label><p className="text-xs text-slate-500">Selecciona el idioma de la plataforma.</p></div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="pt">Portugués</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-[#002D62]"><Bell className="h-5 w-5" />Notificaciones</h3>
          <div className="flex items-center justify-between py-2">
            <div><Label>Notificaciones por email</Label><p className="text-xs text-slate-500">Recibe actualizaciones y alertas en tu correo.</p></div>
            <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div><Label>Notificaciones push</Label><p className="text-xs text-slate-500">Alertas en tiempo real en tu dispositivo.</p></div>
            <Switch checked={notifPush} onCheckedChange={setNotifPush} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div><Label>Contenido y promociones</Label><p className="text-xs text-slate-500">Novedades, cursos y ofertas especiales.</p></div>
            <Switch checked={notifMarketing} onCheckedChange={setNotifMarketing} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-[#002D62]"><Shield className="h-5 w-5" />Privacidad</h3>
          <p className="text-sm text-slate-700">Tus datos son privados por diseño. Solo tú puedes ver la información que generas. El Super Administrador no tiene acceso automático a tu contenido. Puedes gestionar permisos y revisar el historial de accesos autorizados desde esta sección.</p>
        </div>
      </div>
    </section>
  );
}