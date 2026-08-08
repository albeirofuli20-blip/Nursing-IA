export function exportAppSummaryToWord() {
  const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Nurse Master IA - Resumen del Proyecto</title>
<style>
  body { font-family: 'Calibri', sans-serif; color: #1e293b; line-height: 1.6; }
  h1 { color: #002D62; font-size: 28px; border-bottom: 3px solid #00A8B5; padding-bottom: 8px; }
  h2 { color: #002D62; font-size: 18px; margin-top: 28px; }
  h3 { color: #00A8B5; font-size: 14px; margin-top: 18px; }
  h4 { color: #475569; font-size: 13px; margin-top: 12px; }
  .subtitle { color: #64748b; font-size: 13px; }
  .cover { text-align: center; padding: 50px 0; }
  .cover h1 { font-size: 30px; border: none; }
  .cover .tagline { color: #00A8B5; font-size: 15px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  td, th { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; text-align: left; }
  th { background: #002D62; color: white; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; font-size: 13px; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center; }
  .pagebreak { page-break-before: always; }
</style>
</head>
<body>

<div class="cover">
  <h1>Nurse Master IA</h1>
  <p class="tagline">Plataforma Inteligente para la Automatización y Soporte de Decisiones en el Proceso de Atención de Enfermería (PAE)</p>
  <p class="subtitle">Resumen del proyecto &middot; ${date}</p>
</div>

<h2>1. INTRODUCCIÓN Y PLANTEAMIENTO DEL PROBLEMA</h2>

<h3>1.1. Carga Operativa en la Documentación Clínica</h3>
<p>La documentación clínica representa una de las principales cargas operativas del personal de enfermería. Los profesionales dedican una proporción significativa de su jornada a tareas administrativas —registro de valoración, llenado de escalas, transcripción de planes de cuidado— que restan tiempo al cuidado directo del paciente. Esta carga se agrava en entornos hospitalarios con alta rotación, escasez de personal y sistemas fragmentados. La falta de herramientas digitales integradas provoca redundancia, errores de transcripción y variabilidad en la calidad documental.</p>

<h3>1.2. Desafíos en la Integración de Taxonomías NANDA, NOC y NIC</h3>
<p>Las taxonomías estandarizadas NANDA-I (diagnósticos), NOC (resultados) y NIC (intervenciones) constituyen el lenguaje estructurado de la disciplina enfermera. Sin embargo, su aplicación clínica enfrenta barreras: conocimiento taxonómico disperso, dificultad para vincular diagnósticos con resultados e intervenciones coherentes, y ausencia de herramientas que automaticen la sugerencia basada en evidencia. La integración de estas tres taxonomías en un flujo asistido por IA es el núcleo funcional de Nurse Master IA.</p>

<h2>2. JUSTIFICACIÓN Y MARCO DISCIPLINAR</h2>

<h3>2.1. Práctica Basada en la Evidencia (PBE) en Enfermería</h3>
<p>La Práctica Basada en la Evidencia exige que las decisiones clínicas se fundamenten en la mejor evidencia disponible, combinada con la experiencia del profesional y las preferencias del paciente. Nurse Master IA materializa este principio al integrar guías clínicas vigentes, escalas validadas y recomendaciones generadas por IA con citaciones obligatorias, asegurando que cada sugerencia sea trazable a una fuente consultable.</p>

<h3>2.2. Modelos de Valoración: Gordon y Henderson</h3>
<p>El sistema incorpora los 11 patrones funcionales de Marjory Gordon y las 14 necesidades de Virginia Henderson como marcos de valoración estructurados. El wizard de captura recoge datos siguiendo ambos modelos, permitiendo una valoración integral que abarca desde necesidades fisiológicas básicas hasta patrones de salud percibida, facilitando la identificación de diagnósticos NANDA pertinentes.</p>

<h2>3. OBJETIVOS DEL PROYECTO</h2>

<h3>3.1. Objetivo General</h3>
<p>Desarrollar una plataforma inteligente que automatice la documentación clínica del Proceso de Atención de Enfermería (PAE), integre las taxonomías NANDA, NOC y NIC con apoyo de inteligencia artificial, y sirva de soporte para la toma de decisiones clínicas de estudiantes y profesionales de enfermería.</p>

<h3>3.2. Objetivos Específicos</h3>
<ul>
  <li>Centralizar la valoración del paciente en un flujo unificado de 7 pasos (wizard) que integre datos demográficos, clínicos, valoración por patrones de Gordon/Henderson y escalas clínicas.</li>
  <li>Generar planes de cuidado PAE con salidas NANDA, NOC y NIC independientes mediante IA, con citaciones obligatorias y validación profesional.</li>
  <li>Construir asistentes clínicos para medicamentos, laboratorios y procedimientos con herramientas de cálculo, verificación de interacciones y reconocimiento visual.</li>
  <li>Garantizar la seguridad y privacidad de los datos mediante Row-Level Security (RLS), arquitectura multi-tenant y trazabilidad de auditoría.</li>
  <li>Establecer un ecosistema educativo y comercial SaaS sostenible con cursos, marketplace y planes de suscripción.</li>
</ul>

<h2>4. METODOLOGÍA Y ARQUITECTURA TECNOLÓGICA</h2>

<h3>4.1. Diseño del Sistema y Despliegue Multiplataforma</h3>
<p>Arquitectura basada en React + Tailwind CSS para el frontend y Base44 BaaS para el backend (autenticación, base de datos, integraciones y hosting). El diseño responsive permite publicación nativa en iOS, Android y web desde un único código base. La arquitectura de microservicios favorece la escalabilidad y el mantenimiento modular.</p>

<h3>4.2. Seguridad por Diseño y Control de Acceso (RLS)</h3>
<p>El control de acceso se implementa mediante Row-Level Security (RLS) a nivel de entidad, con roles diferenciados: enfermero, docente, estudiante, institución y administrador. Cada usuario accede únicamente a los registros que le pertenecen o que su rol le permite ver. La arquitectura multi-tenant asegura la separación institucional. El principio de privacidad por diseño garantiza el aislamiento estricto de los datos de cada usuario.</p>

<h3>4.3. Capa de Inteligencia Artificial Desacoplada (AIService)</h3>
<p>La IA se integra mediante una capa desacoplada (AIService) que abstrae el proveedor subyacente, permitiendo conmutar entre Base44 nativo y Abacus.AI sin alterar la lógica de negocio. La configuración del proveedor, los prompts del sistema (PAE, NANDA, chat, evolución, educativo), las cuotas de tokens y los guardrails se gestionan centralizadamente desde la entidad AiConfig, accesible solo a administradores.</p>

<h2>5. DESARROLLO INGENIERIL Y MÓDULOS FUNCIONALES</h2>

<h3>5.1. Algoritmo del Flujo Unificado del PAE (Wizard de 7 Pasos)</h3>
<p>El flujo unificado de captura recoge secuencialmente en un único wizard continuo:</p>
<ul>
  <li><b>Paso 1:</b> Identificación del paciente (datos demográficos, fecha de nacimiento, ingreso, servicio, cama).</li>
  <li><b>Paso 2:</b> Historia social y determinantes de salud.</li>
  <li><b>Paso 3:</b> Datos clínicos (antecedentes, medicación actual, alergias).</li>
  <li><b>Paso 4:</b> Valoración subjetiva y objetiva, con análisis visual de imágenes clínicas mediante IA.</li>
  <li><b>Paso 5:</b> Patrones funcionales de Gordon (11 patrones) y necesidades de Henderson.</li>
  <li><b>Paso 6:</b> Estudios diagnósticos y resultados de laboratorio.</li>
  <li><b>Paso 7:</b> Escalas clínicas (Glasgow, Braden, Norton, Barthel, etc.) con recomendación automática y comparación basal/evolución/alta.</li>
</ul>
<p>La generación del PAE produce salidas NANDA, NOC y NIC independientes, con exportación a PDF/Word en formato institucional Areandina.</p>

<h3>5.2. Asistente Farmacológico y Verificador de Interacciones Clínicas</h3>
<p>Módulo de medicamentos con fichas completas: mecanismo de acción, indicaciones, contraindicaciones, dosificación por población (adultos, pediatría, geriatría, embarazo, insuficiencia renal/hepática), administración IV, compatibilidades, cuidados de enfermería (valoración previa, durante y posterior), signos de alarma, educación al paciente, taxonomía NANDA/NIC/NOC, reacciones adversas, interacciones, antídotos, clasificación LASA y medicamentos de alto riesgo (ISMP). Incluye herramientas especializadas:</p>
<ul>
  <li><b>Calculadora de dosis:</b> cálculo por peso, frecuencia y concentración disponible.</li>
  <li><b>Verificador de interacciones:</b> análisis IA de interacciones medicamentosas con clasificación de severidad (leve, moderada, severa) y recomendación clínica.</li>
  <li><b>Reconocimiento por foto:</b> identificación visual de medicamentos mediante IA a partir de imagen del blíster, ampolla o caja.</li>
  <li><b>Favoritos y exportación PDF</b> por medicamento.</li>
</ul>

<h3>5.3. Módulo de Interpretación de Laboratorios y Procedimientos Estandarizados</h3>
<p>El módulo de laboratorios ofrece interpretación clínica con rangos de referencia por población (adulto masculino/femenino, pediatría, geriatría), valores críticos, tipo de muestra, instrucciones de recolección, interpretación de valores bajos/altos/normales, taxonomía NANDA/NIC/NOC, implicaciones de enfermería y acciones de seguimiento. El módulo de procedimientos proporciona guías paso a paso con checklist interactivo, objetivo, indicaciones, contraindicaciones, material requerido, preparación del paciente, complicaciones y su prevención, cuidados posteriores, parámetros a monitorizar y educación al paciente. Ambos módulos cuentan con asistente IA, favoritos y exportación PDF.</p>

<h2>6. ÉTICA, GOBERNANZA DE DATOS Y GUARDRAILS DE LA IA</h2>

<h3>6.1. Mitigación de Sesgos y Alucinaciones en la IA</h3>
<p>Los guardrails de IA están habilitados por defecto. Los prompts del sistema están diseñados para anclar las respuestas en evidencia clínica y taxonomía estandarizada, reduciendo el riesgo de alucinaciones. La configuración permite limitar tokens por solicitud y por mes, controlando el consumo y la exposición. La capa AIService valida las respuestas antes de presentarlas al usuario.</p>

<h3>6.2. Citaciones Obligatorias y Validación del Profesional Humano</h3>
<p>La configuración del sistema establece la citación obligatoria como requisito por defecto: toda sugerencia generada por IA debe acompañarse de su fuente consultable. El sistema enfatiza que la IA es un soporte asistivo, no sustitutivo: la decisión clínica final corresponde siempre al profesional de enfermería, quien valida, edita y aprueba cada plan generado.</p>

<h3>6.3. Trazabilidad y Logs de Auditoría (AuditLog)</h3>
<p>La entidad AuditLog registra todas las acciones sensibles: login/logout, creación/edición/eliminación de pacientes y PAE, generación y chat de IA, cambios de configuración, invitaciones de usuarios, exportaciones de datos y cambios de rol. Cada registro incluye usuario, descripción, tipo de entidad y metadatos. El acceso a los logs está restringido a administradores, garantizando la trazabilidad completa y el cumplimiento normativo.</p>

<h2>7. ECOSISTEMA EDUCATIVO, TRANSFERENCIA Y COMUNIDAD</h2>

<h3>7.1. Impacto en la Atención Primaria en Salud (APS)</h3>
<p>El módulo de Comunidad y APS extiende el alcance de la plataforma más allá del ámbito hospitalario, proporcionando herramientas para la atención primaria, la educación al paciente y la promoción de la salud comunitaria. El PAE comunitario se integra como tipo diferenciado dentro del wizard, adaptando la valoración y los planes al contexto extrahospitalario.</p>

<h3>7.2. Modelo de Ingresos SaaS y Sostenibilidad Financiera</h3>
<p>El modelo de negocio SaaS establece planes de suscripción por niveles, con gestión de usuarios y roles asignables. El marketplace de recursos clínicos y educativos (cursos, plantillas, protocolos, casos clínicos) complementa los ingresos recurrentes. La plataforma de cursos con certificación refuerza la vertical educativa. Este modelo garantiza la sostenibilidad financiera y la escalabilidad del proyecto.</p>

<h2>8. RESULTADOS ESPERADOS Y CONCLUSIONES</h2>

<h3>8.1. Modelo de Madurez Progresiva: Aprende, Aplica, Analiza, Evoluciona</h3>
<p>El sistema sigue un modelo de madurez progresiva de cuatro etapas:</p>
<ul>
  <li><b>Aprende:</b> el estudiante y el profesional acceden a guías, cursos, fichas farmacológicas y procedimientos estandarizados.</li>
  <li><b>Aplica:</b> el wizard de 7 pasos guía la valoración y la generación asistida de PAE con NANDA/NOC/NIC.</li>
  <li><b>Analiza:</b> las escalas clínicas con comparación basal/evolución/alta y los reportes permiten el análisis del estado del paciente.</li>
  <li><b>Evoluciona:</b> la retroalimentación del uso, los logs de auditoría y las métricas de negocio alimentan la mejora continua de la plataforma.</li>
</ul>

<h3>8.2. Impacto en la Formación Académica e Investigación Clínica</h3>
<p>Nurse Master IA impacta la formación académica al proporcionar a los estudiantes un entorno seguro para practicar la construcción de PAE con retroalimentación inmediata de IA y taxonomía estandarizada. Para la investigación clínica, el módulo de investigación y los reportes agregados facilitan el análisis de datos clínicos. La integración de guías basadas en evidencia, citaciones obligatorias y trazabilidad de auditoría convierte a la plataforma en una herramienta válida tanto para la docencia como para la generación de conocimiento enfermero.</p>

<h2>ANEXO: Entidades de Datos del Sistema</h2>
<table>
  <tr><th>Entidad</th><th>Descripción</th></tr>
  <tr><td>Patient</td><td>Datos demográficos y clínicos del paciente</td></tr>
  <tr><td>CarePlan</td><td>Planes de atención de enfermería (PAE) con NANDA/NOC/NIC</td></tr>
  <tr><td>Medication</td><td>Fichas farmacológicas completas</td></tr>
  <tr><td>LabTest</td><td>Exámenes de laboratorio con interpretación</td></tr>
  <tr><td>Procedure</td><td>Procedimientos con pasos y checklist</td></tr>
  <tr><td>Guide</td><td>Guías clínicas basadas en evidencia</td></tr>
  <tr><td>Course</td><td>Cursos educativos</td></tr>
  <tr><td>MarketplaceItem</td><td>Recursos del marketplace</td></tr>
  <tr><td>AiConfig</td><td>Configuración de IA del sistema</td></tr>
  <tr><td>AuditLog</td><td>Registro de auditoría</td></tr>
  <tr><td>User</td><td>Usuarios con roles y planes de suscripción</td></tr>
</table>

<div class="footer">
  Nurse Master IA &middot; Plataforma Inteligente para la Automatización y Soporte de Decisiones en el PAE<br>
  Documento generado automáticamente &middot; ${date}<br>
  Plataforma desarrollada sobre Base44
</div>

</body>
</html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Nurse_Master_IA_Resumen_Proyecto.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}