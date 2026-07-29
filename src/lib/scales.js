export const SCALES = {
  glasgow: { name: "Glasgow", category: "Neurológico", max: 15, items: [
    { key: "eye", label: "Apertura ocular", options: [["4", "Espontánea"], ["3", "A la voz"], ["2", "Al dolor"], ["1", "Ninguna"]] },
    { key: "verbal", label: "Respuesta verbal", options: [["5", "Orientada"], ["4", "Confusa"], ["3", "Palabras"], ["2", "Sonidos"], ["1", "Ninguna"]] },
    { key: "motor", label: "Respuesta motora", options: [["6", "Obedece"], ["5", "Localiza"], ["4", "Retira"], ["3", "Flexión"], ["2", "Extensión"], ["1", "Ninguna"]] }
  ], interpret: (s) => s >= 13 ? "Leve" : s >= 9 ? "Moderado" : s >= 3 ? "Severo" : "—" },
  braden: { name: "Braden", category: "Riesgo de UPP", max: 23, items: [
    { key: "sensory", label: "Percepción sensorial", options: [["4", "Completa"], ["3", "Limitada"], ["2", "Muy limitada"], ["1", "Ausente"]] },
    { key: "moisture", label: "Humedad", options: [["4", "Raramente"], ["3", "Ocasional"], ["2", "Frecuente"], ["1", "Constante"]] },
    { key: "activity", label: "Actividad", options: [["4", "Caminando"], ["3", "Silla"], ["2", "Encamado"], ["1", "Inmóvil"]] },
    { key: "mobility", label: "Movilidad", options: [["4", "Completa"], ["3", "Ligeramente limitada"], ["2", "Muy limitada"], ["1", "Inmóvil"]] },
    { key: "nutrition", label: "Nutrición", options: [["4", "Excelente"], ["3", "Adecuada"], ["2", "Pobre"], ["1", "Muy pobre"]] },
    { key: "friction", label: "Fricción/Cizalla", options: [["3", "Sin problema"], ["2", "Potencial"], ["1", "Problema"]] }
  ], interpret: (s) => s >= 19 ? "Sin riesgo" : s >= 15 ? "Riesgo leve" : s >= 12 ? "Riesgo moderado" : s <= 9 ? "Riesgo severo" : "Riesgo alto" },
  eva: { name: "EVA (Dolor)", category: "Dolor", max: 10, single: true, interpret: (s) => s === 0 ? "Sin dolor" : s <= 3 ? "Leve" : s <= 6 ? "Moderado" : s <= 9 ? "Severo" : "Máximo" },
  barthel: { name: "Barthel", category: "Independencia", max: 100, items: [
    { key: "feeding", label: "Alimentación", options: [["10", "Independiente"], ["5", "Ayuda"], ["0", "Dependiente"]] },
    { key: "bathing", label: "Baño", options: [["5", "Independiente"], ["0", "Dependiente"]] },
    { key: "grooming", label: "Aseo personal", options: [["5", "Independiente"], ["0", "Dependiente"]] },
    { key: "dressing", label: "Vestido", options: [["10", "Independiente"], ["5", "Ayuda"], ["0", "Dependiente"]] },
    { key: "bowels", label: "Control intestinal", options: [["10", "Continente"], ["5", "Ocasional"], ["0", "Incontinente"]] },
    { key: "bladder", label: "Control vesical", options: [["10", "Continente"], ["5", "Ocasional"], ["0", "Incontinente"]] },
    { key: "toilet", label: "Uso de retrete", options: [["10", "Independiente"], ["5", "Ayuda"], ["0", "Dependiente"]] },
    { key: "transfer", label: "Transferencia", options: [["15", "Independiente"], ["10", "Mínima ayuda"], ["5", "Gran ayuda"], ["0", "Incapaz"]] },
    { key: "walking", label: "Deambulación", options: [["15", "Independiente"], ["10", "Con ayuda"], ["5", "En silla"], ["0", "Inmóvil"]] },
    { key: "stairs", label: "Subir escaleras", options: [["10", "Independiente"], ["5", "Ayuda"], ["0", "Incapaz"]] }
  ], interpret: (s) => s >= 90 ? "Independiente" : s >= 60 ? "Dependencia leve" : s >= 40 ? "Dependencia moderada" : s >= 20 ? "Dependencia severa" : "Dependencia total" },
  norton: { name: "Norton", category: "Riesgo de UPP", max: 20, items: [
    { key: "physical", label: "Estado físico", options: [["4", "Bueno"], ["3", "Regular"], ["2", "Malo"], ["1", "Muy malo"]] },
    { key: "mental", label: "Estado mental", options: [["4", "Alerta"], ["3", "Apatía"], ["2", "Confuso"], ["1", "Estupor"]] },
    { key: "activity", label: "Actividad", options: [["4", "Ambulante"], ["3", "Camina con ayuda"], ["2", "Silla"], ["1", "Encamado"]] },
    { key: "mobility", label: "Movilidad", options: [["4", "Completa"], ["3", "Ligeramente limitada"], ["2", "Muy limitada"], ["1", "Inmóvil"]] },
    { key: "incontinence", label: "Incontinencia", options: [["4", "No"], ["3", "Ocasional"], ["2", "Frecuente"], ["1", "Doble"]] }
  ], interpret: (s) => s >= 15 ? "Sin riesgo" : s >= 12 ? "Riesgo leve" : s <= 11 ? "Riesgo alto" : "Riesgo moderado" },
  morse: { name: "Morse (Caídas)", category: "Riesgo de Caídas", max: 125, items: [
    { key: "history", label: "Antecedente de caída", options: [["0", "No"], ["25", "Sí"]] },
    { key: "diagnosis", label: "Diagnóstico secundario", options: [["0", "No"], ["15", "Sí"]] },
    { key: "ambulation", label: "Ayuda para caminar", options: [["0", "Sin ayuda"], ["15", "Muleta/bastón"], ["30", "Muebles"]] },
    { key: "iv", label: "Terapia IV", options: [["0", "No"], ["20", "Sí"]] },
    { key: "gait", label: "Marcha", options: [["0", "Normal"], ["10", "Débil"], ["20", "Alterada"]] },
    { key: "mental", label: "Estado mental", options: [["0", "Orientado"], ["15", "Olvida límites"]] }
  ], interpret: (s) => s < 25 ? "Sin riesgo" : s < 51 ? "Riesgo bajo" : "Riesgo alto" }
};