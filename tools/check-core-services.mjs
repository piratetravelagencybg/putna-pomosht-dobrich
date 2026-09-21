import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  ['repatrirane.html', 'Репатриране на автомобили'],
  ['podavane-na-tok.html', 'Подаване на ток в Добрич'],
  ['smqna-na-guma.html', 'Помощ при спукана гума в Добрич'],
];
const errors = [];
const text = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const one = (source, regex, label, file) => {
  const matches = [...source.matchAll(regex)];
  if (matches.length !== 1) errors.push(`${file}: expected one ${label}, found ${matches.length}`);
  return matches[0]?.[1] ?? '';
};
const strip = (value) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

for (const [file, expectedH1] of pages) {
  const source = text(file);
  const title = one(source, /<title>([\s\S]*?)<\/title>/g, 'title', file);
  const description = one(source, /<meta name="description" content="([^"]+)">/g, 'description', file);
  const h1 = strip(one(source, /<h1[^>]*>([\s\S]*?)<\/h1>/g, 'H1', file));
  const canonical = one(source, /<link rel="canonical" href="([^"]+)">/g, 'canonical', file);
  const json = one(source, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, 'JSON-LD block', file);

  if (!title || title.length > 60) errors.push(`${file}: missing/long title (${title.length})`);
  if (!description || description.length > 165) errors.push(`${file}: missing/long description (${description.length})`);
  if (h1 !== expectedH1) errors.push(`${file}: unexpected H1: ${h1}`);
  if (canonical !== `https://www.putnapomoshtsisi.com/${file}`) errors.push(`${file}: bad canonical`);
  if (!source.includes('<meta name="robots" content="index, follow">')) errors.push(`${file}: not explicitly index/follow`);
  if (!source.includes('href="tel:+359896661319"')) errors.push(`${file}: phone CTA missing`);
  if (!source.includes('data-home-location')) errors.push(`${file}: location CTA missing`);
  if (!source.includes('class="breadcrumbs"')) errors.push(`${file}: visible breadcrumbs missing`);
  if (!source.includes('href="patna-pomosht-dobrich.html"')) errors.push(`${file}: Dobrich link missing`);
  if (!source.includes('href="/#tehnika"')) errors.push(`${file}: equipment link missing`);
  if (!source.includes('href="/#kontakt"')) errors.push(`${file}: contact link missing`);
  if (!source.includes('OWNER_VERIFICATION_REQUIRED')) errors.push(`${file}: owner verification marker missing`);

  let data;
  try { data = JSON.parse(json); } catch (error) { errors.push(`${file}: JSON-LD parse: ${error.message}`); continue; }
  const graph = data['@graph'] ?? [];
  for (const type of ['Service', 'BreadcrumbList', 'FAQPage']) {
    if (graph.filter((item) => item['@type'] === type).length !== 1) errors.push(`${file}: expected one ${type}`);
  }
  const service = graph.find((item) => item['@type'] === 'Service');
  if (service?.provider?.['@id'] !== 'https://www.putnapomoshtsisi.com/#business') errors.push(`${file}: Service provider is not central business @id`);
  const faq = graph.find((item) => item['@type'] === 'FAQPage');
  for (const item of faq?.mainEntity ?? []) {
    const question = item.name;
    const answer = item.acceptedAnswer?.text;
    if (!source.includes(`<span>${question}</span>`)) errors.push(`${file}: schema FAQ question not visible: ${question}`);
    if (!source.includes(`<p>${answer}</p>`)) errors.push(`${file}: schema FAQ answer not visible: ${question}`);
  }

  for (const match of source.matchAll(/<(?:a|link|img|script)[^>]+(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|tel:|viber:|#|\/\#)/.test(href)) continue;
    const local = href.split('#')[0].split('?')[0];
    if (local && !fs.existsSync(path.join(root, local))) errors.push(`${file}: missing local target ${local}`);
  }
}

const sitemap = text('sitemap.xml');
for (const [file] of pages) {
  if (!sitemap.includes(`https://www.putnapomoshtsisi.com/${file}`)) errors.push(`sitemap: missing ${file}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${pages.length} core service pages; metadata, H1, schema, FAQ, CTAs, links and sitemap verified.`);
