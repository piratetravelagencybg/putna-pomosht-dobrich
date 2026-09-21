/* Homepage-only enhancements. Coordinates are never sent automatically. */
(() => {
  const dialog = document.querySelector('#location-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  document.body.classList.add('home-enhanced');
  const en = document.documentElement.lang === 'en';
  const locate = dialog.querySelector('[data-locate]');
  const status = dialog.querySelector('[data-home-location-status]');
  const result = dialog.querySelector('[data-location-result]');
  const field = dialog.querySelector('#location-map-link');
  const sms = dialog.querySelector('[data-location-sms]');
  let generation = 0;
  let opener;
  const say = (bg, english) => { status.textContent = en ? english : bg; };
  const reset = () => {
    generation++;
    locate.disabled = false;
    result.hidden = true;
    field.value = '';
    sms.removeAttribute('href');
    status.textContent = '';
  };
  document.querySelectorAll('[data-home-location]').forEach(button => {
    button.addEventListener('click', () => { opener = button; reset(); dialog.showModal(); });
  });
  dialog.querySelector('[data-location-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { reset(); opener?.focus(); });
  locate.addEventListener('click', () => {
    reset();
    const request = generation;
    if (!navigator.geolocation || !window.isSecureContext) {
      say('Локацията не е достъпна. Обади се или изпрати ориентир във Viber/WhatsApp.', 'Location is unavailable. Call us or send a landmark via Viber/WhatsApp.');
      return;
    }
    locate.disabled = true;
    say('Търсим местоположението…', 'Finding your location…');
    navigator.geolocation.getCurrentPosition(position => {
      if (request !== generation || !dialog.open) return;
      locate.disabled = false;
      const { latitude, longitude } = position.coords;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        say('Не получихме валидна локация. Опитай отново или се обади.', 'No valid location was received. Try again or call us.');
        return;
      }
      field.value = 'https://www.google.com/maps?q=' + latitude + ',' + longitude;
      const body = (en ? 'I need roadside assistance. My location: ' : 'Имам нужда от пътна помощ. Моята локация: ') + field.value;
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      sms.href = 'sms:+359896661319' + (ios ? '&' : '?') + 'body=' + encodeURIComponent(body);
      result.hidden = false;
      say('Провери точката на картата преди изпращане. Отвори SMS или копирай линка.', 'Check the map pin before sending. Open SMS or copy the link.');
    }, error => {
      if (request !== generation || !dialog.open) return;
      locate.disabled = false;
      if (error.code === 1) say('Достъпът до локацията е отказан. Можеш да се обадиш или да изпратиш ориентир.', 'Location permission was denied. You can call us or send a landmark.');
      else say('Не успяхме да намерим локацията. Опитай отново или се обади.', 'Could not find your location. Try again or call us.');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  });
  dialog.querySelector('[data-location-copy]').addEventListener('click', async () => {
    if (!field.value) return;
    const request = generation;
    try {
      await navigator.clipboard.writeText(field.value);
      if (request === generation && dialog.open) say('Линкът е копиран. Изпрати го във Viber, WhatsApp или друго приложение.', 'Link copied. Send it via Viber, WhatsApp or another app.');
    } catch {
      if (request !== generation || !dialog.open) return;
      field.focus();
      field.select();
      say('Копирай маркирания линк ръчно.', 'Copy the selected link manually.');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || dialog.open) return;
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (nav?.classList.contains('open')) {
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.focus();
    }
  });
})();
