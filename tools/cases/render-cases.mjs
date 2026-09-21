// Offline, read-only renderer: no site writes and no client-side fetch.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localPath = value => typeof value === 'string' && /^(?:assets\/images\/|снимки\/)[^?#]+\.(?:jpg|jpeg|png|webp)$/i.test(value) && !value.includes('..');
const servicePath = value => typeof value === 'string' && /^[a-z-]+\.html$/.test(value);
export function renderCases(entries) {
  const approved = entries.filter(entry => entry.approved === true);
  if (!approved.length) return '';
  const cards = approved.map(entry => {
    for (const key of ['title','location','vehicleType','problem','solution','equipment','period','verificationReference','reviewedBy']) {
      if (typeof entry[key] !== 'string' || !entry[key].trim()) throw new Error('Missing case field: '+key);
    }
    if (entry.publicationPermission !== true || !servicePath(entry.relatedService)) throw new Error('Permission/service missing');
    if (!Array.isArray(entry.photos) || entry.photos.length < 2 || entry.photos.length > 5) throw new Error('Need 2–5 real photos');
    const photos = entry.photos.map(photo => {
      if (!localPath(photo.src) || !photo.alt || !Number.isInteger(photo.width) || photo.width <= 0 || !Number.isInteger(photo.height) || photo.height <= 0) throw new Error('Invalid photo');
      return '<img src="'+escape(photo.src)+'" alt="'+escape(photo.alt)+'" width="'+photo.width+'" height="'+photo.height+'" loading="lazy" decoding="async">';
    }).join('');
    return '<article class="content-block"><h3>'+escape(entry.title)+'</h3><p>'+escape(entry.location)+' · '+escape(entry.period)+' · '+escape(entry.vehicleType)+'</p><p>'+escape(entry.problem)+'</p><p>'+escape(entry.solution)+'</p><p>Техника: '+escape(entry.equipment)+'</p>'+photos+'<p><a href="'+escape(entry.relatedService)+'">Повече за услугата</a></p></article>';
  });
  return '<section class="section" id="izvarsheni-sluchai"><div class="container"><h2>Извършени случаи</h2><div class="content-stack">'+cards.join('')+'</div></div></section>';
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = JSON.parse(readFileSync(new URL('./dobrich.json', import.meta.url), 'utf8'));
  process.stdout.write(renderCases(data.cases));
}
