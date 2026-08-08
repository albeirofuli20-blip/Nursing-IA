export function exportAppSummaryToWord() {
  const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Nurse Master IA - Resumen de la Aplicación</title>
<style>
  body { font-family: 'Calibri', sans-serif; color: #1e293b; line-height: 1.6; }
  h1 { color: #002D62; font-size: 28px; border-bottom: 3px solid #00A8B5; padding-bottom: 8px; }
  h2 { color: #002D62; font-size: 18px; margin-top: 24px; }
  h3 { color: #00A8B5; font-size: 14px; margin-top: 16px; }
  .subtitle { color: #64748b; font-size: 13px; }
  .cover { text-align: center; padding: 40px 0; }
  .cover h1 { font-size: 36px; border: none; }
  .cover .tagline { color: #00A8B5; font-size: 16px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  td, th { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; text-align: left; }
  th { background: #002D62; color: white; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; font-size: 13px; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center; }
  .badge { display: inline-block; background: #00A8B5; color: white; padding: 2px 10px; border-radius: 4px; font-size: 11px; }
</style>
</head>
<body>

<div class="cover">
  <h1>Nurse Master IA</h1>
  <p class="tagline">Plataforma inteligente para el Proceso de Atención de Enfermería (PAE)</p>
  <p class="subtitle">Resumen ejecutivo de la aplicación &middot; ${date}</p>
</div>

<h2>1. Visión General</h2>
<p>Nurse Master IA es una plataforma SaaS diseñada para estudiantes y profesionales de enfermería que automatiza la documentación clínica, integra cuidados basados en evidencia y apoya decisiones clínicas mediante inteligencia artificial. El sistema centraliza la valoración del paciente y construye planes de cuidado NANDA, NOC y NIC con apoyo de IA, escalas clínicas y revisión profesional.</p>

<h2>2. Arquitectura y Tecnología</h2>
<ul>
  <li><b>Frontend:</b> React + Tailwind CSS, diseño responsive (móvil, web, tablet).</li>
  <li><b>Backend:</b> Base44 BaaS (autenticación, base de datos, integraciones, hosting).</li>
  <li><b>IA:</b> Capa desacoplada AIService con soporte multi-proveedor (Base44 nativo, Abacus.AI).</li>
  <li><b>Seguridad:</b> Row-Level Security (RLS) con roles: enfermero, docente, estudiante, institución, administrador.</li>
  <li><b>Auditoría:</b> Registro de acciones sensibles (login, creación/edición de pacientes, IA, exportaciones, cambios de configuración).</li>
  <li><b>Publicación:</b> iOS, Android y web desde el mismo código.</li>
</ul>

<h2>3. Identidad Visual</h2>
<p>Branding "Nurse Master IA" con paleta corporativa azul/turquesa: <b>#002D62</b> (azul institucional) y <b>#00A8B5</b> (turquesa de acento). Tono profesional, orientado a uso académico y clínico. Todas las cadenas visibles en español.</p>

<h2>4. Módulos Funcionales</h2>

<h3>4.1 Pacientes y PAE</h3>
<p>Flujo unificado de 7 pasos (wizard) que integra captura de datos del paciente, valoración y escalas en un solo flujo continuo:</p>
<ul>
  <li>Identificación del paciente (datos demográficos, fecha de nacimiento, ingreso).</li>
  <li>Historia social y determinantes de salud.</li>
  <li>Datos clínicos (antecedentes, medicación, alergias).</li>
  <li>Valoración subjetiva y objetiva (con análisis visual de imágenes clínicas).</li>
  <li>Patrones funcionales de Gordon (11 patrones) y necesidades de Henderson.</li>
  <li>Estudios diagnósticos y laboratorios.</li>
  <li>Escalas clínicas (Glasgow, Braden, Norton, Barthel, etc.) con recomendación automática y comparación basal/evolución/alta.</li>
</ul>
<p>Generación automática de PAE con salidas NANDA, NOC y NIC independientes. Exportación a PDF/Word con formato institucional Areandina.</p>

<h3>4.2 Medicamentos</h3>
<p>Asistente clínico completo con fichas detalladas: mecanismo de acción, indicaciones, contraindicaciones, dosificación por población (adultos, pediatría, geriatría, embarazo, insuficiencia renal/hepática), administración IV, compatibilidades, cuidados de enfermería (valoración previa, durante y posterior), signos de alarma, educación al paciente, taxonomía NANDA/NIC/NOC, reacciones adversas, interacciones, antídotos, clasificación LASA y medicamentos de alto riesgo (ISMP).</p>
<ul>
  <li><b>Calculadora de dosis:</b> cálculo por peso, frecuencia y concentración.</li>
  <li><b>Verificador de interacciones:</b> análisis IA de interacciones medicamentosas con severidad.</li>
  <li><b>Reconocimiento por foto:</b> identificación visual de medicamentos mediante IA.</li>
  <li><b>Favoritos</b> y <b>exportación PDF</b> por medicamento.</li>
</ul>

<h3>4.3 Laboratorios</h3>
<p>Interpretación clínica con rangos de referencia por población (adulto masculino/femenino, pediatría, geriatría), valores críticos, tipo de muestra, instrucciones de recolección, interpretación de valores bajos/altos/normales, taxonomía NANDA/NIC/NOC, implicaciones de enfermería y acciones de seguimiento. Asistente IA, favoritos y exportación PDF.</p>

<h3>4.4 Procedimientos</h3>
<p>Guías paso a paso con checklist interactivo, objetivo, indicaciones, contraindicaciones, material requerido, preparación del paciente, complicaciones y su prevención, cuidados posteriores, parámetros a monitorizar, taxonomía NANDA/NIC/NOC, educación al paciente y nivel de dificultad. Asistente IA, favoritos y exportación PDF.</p>

<h3>4.5 Chat IA Clínico</h3>
<p>Asistente conversacional con contexto de paciente y guías clínicas, respuestas basadas en evidencia y taxonomía NANDA/NIC/NOC.</p>

<h3>4.6 Guías Clínicas</h3>
<p>Repositorio de protocolos y guías basadas en evidencia, con búsqueda web, estado de vigencia y carga de documentos.</p>

<h3>4.7 Educación al Paciente</h3>
<p>Módulo de recursos educativos para pacientes y familias.</p>

<h3>4.8 Comunidad y APS</h3>
<p>Espacio colaborativo y herramientas para Atención Primaria en Salud.</p>

<h3>4.9 Investigación</h3>
<p>Soporte para proyectos y análisis clínico-investigativo.</p>

<h3>4.10 Reportes y Notificaciones</h3>
<p>Generación de reportes clínicos y sistema de notificaciones internas.</p>

<h2>5. Ecosistema Educativo y Comercial</h2>

<h3>5.1 Cursos</h3>
<p>Plataforma de cursos con niveles (básico, intermedio, avanzado), certificación y instructores.</p>

<h3>5.2 Marketplace</h3>
<p>Marketplace de recursos clínicos y educativos: cursos, plantillas, protocolos, casos clínicos.</p>

<h3>5.3 Planes de Suscripción (SaaS)</h3>
<p>Modelo de ingresos SaaS con planes por niveles. Gestión de usuarios con roles y planes asignables.</p>

<h2>6. Panel Administrativo</h2>
<ul>
  <li><b>Negocio:</b> KPIs de negocio, métricas de usuarios, pacientes y planes.</li>
  <li><b>Arquitectura:</b> Documentación de la arquitectura del sistema.</li>
  <li><b>Diseño:</b> Sistema de diseño y componentes.</li>
  <li><b>Módulos:</b> Gestión de módulos funcionales.</li>
  <li><b>IA Config:</b> Configuración de proveedores de IA (Base44/Abacus), prompts del sistema, cuotas de tokens, guardrails, citaciones obligatorias y doble factor.</li>
  <li><b>Auditoría:</b> Registro de acciones sensibles (login, CRUD de pacientes/PAE, IA, configuración, invitaciones, exportaciones, cambios de rol).</li>
  <li><b>Usuarios:</b> Invitación y gestión de usuarios con roles y planes de suscripción.</li>
</ul>

<h2>7. Principios y Seguridad</h2>
<ul>
  <li><b>Privacidad por diseño:</b> datos de usuario estrictamente aislados.</li>
  <li><b>Arquitectura multi-tenant:</b> separación institucional.</li>
  <li><b>RLS:</b> control de acceso por rol y propiedad de registros.</li>
  <li><b>Auditoría completa:</b> trazabilidad de acciones sensibles.</li>
  <li><b>Guardrails de IA:</b> citaciones obligatorias, límites de tokens, verificación profesional.</li>
</ul>

<h2>8. Entidades de Datos</h2>
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
  <tr><td>User</td><td>Usuarios con roles y planes</td></tr>
</table>

<h2>9. Modelo de Madurez y Hoja de Ruta</h2>
<p>El sistema sigue un modelo de madurez progresiva: <b>Aprende &middot; Aplica &middot; Analiza &middot; Evoluciona</b>, con objetivos estratégicos a corto, mediano y largo plazo para escalar la plataforma en el ecosistema académico y clínico.</p>

<div class="footer">
  Nurse Master IA &middot; Documento generado automáticamente &middot; ${date}<br>
  Plataforma desarrollada sobre Base44
</div>

</body>
</html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Nurse_Master_IA_Resumen.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}