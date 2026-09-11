import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * syncBlogFeed — Sincroniza artículos del blog Enfermería Blog como guías clínicas.
 *
 * Lee el feed Atom, parsea las entradas y crea registros Guide para los artículos
 * nuevos (deduplica por source_url). Pensado para ejecutarse desde un workflow
 * programado (sin contexto de usuario), por lo que usa asServiceRole.
 */

const FEED_URL = "https://enfermeriablog.com/feed/atom/";
const SOURCE_NAME = "Enfermería Blog";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const res = await fetch(FEED_URL);
    if (!res.ok) return Response.json({ error: "No se pudo obtener el feed" }, { status: 502 });
    const xml = await res.text();

    const entries = parseAtomEntries(xml);

    // Deduplicar por source_url
    const existing = await base44.asServiceRole.entities.Guide.filter({ source: SOURCE_NAME });
    const existingUrls = new Set((existing || []).map((g) => g.source_url).filter(Boolean));

    const toCreate = entries.filter((e) => e.link && !existingUrls.has(e.link));

    const created = [];
    for (const entry of toCreate) {
      try {
        const guide = await base44.asServiceRole.entities.Guide.create({
          title: entry.title,
          category: entry.category || "Actualidad enfermera",
          source: SOURCE_NAME,
          source_url: entry.link,
          content: entry.content,
          version_date: entry.published ? entry.published.substring(0, 10) : new Date().toISOString().substring(0, 10),
          status: "vigente"
        });
        created.push(guide.title);
      } catch { /* saltar entradas individuales con error */ }
    }

    return Response.json({
      synced: created.length,
      total_feed: entries.length,
      already_existing: entries.length - toCreate.length,
      new_titles: created
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function parseAtomEntries(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = stripHtml(extractTag(block, "title"));
    const link = extractAttr(block, "link", "href");
    const published = extractTag(block, "published") || extractTag(block, "updated");
    const content = extractContent(block);
    if (title && link) entries.push({ title, link, published, content: content || title });
  }
  return entries;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = xml.match(regex);
  return match ? cleanCdata(match[1]).trim() : "";
}

function extractAttr(xml, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`);
  const match = xml.match(regex);
  return match ? match[1] : "";
}

function extractContent(xml) {
  const regex = /<content[^>]*>([\s\S]*?)<\/content>/;
  const match = xml.match(regex);
  if (!match) return "";
  return cleanCdata(match[1]).trim();
}

function cleanCdata(text) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .replace(/\[Continuar leyendo.*?\]/g, "")
    .trim();
}