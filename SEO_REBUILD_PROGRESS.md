# SEO rebuild — прогрес

Baseline: 2026-09-15. Последно обновяване: 2026-09-21.

## Статус

## PHASE 4 — DOBRICH PRIMARY MONEY PAGE — COMPLETE

2026-09-21: **локалната реализация е завършена; release/мобилното приемане остава непълно**. Този статус заменя историческото „Фаза 4 не е започната“ по-долу. Няма commit, push, deploy, DNS или GBP редакции. Фаза 5 не е започната.

### Промени

- Одитът е записан ПРЕДИ редакциите в SEO_PHASE4_DOBRICH.md. Възстановима снимка на всички предходни промени: ../seo-phase4-before-2026-09-21.tgz.
- patna-pomosht-dobrich.html: същият URL, H1 и self-canonical/index-follow/hreflang. Title „Пътна помощ Добрич 24/7 | Репатрак | СИСИ“; нова естествена description и съответстващи OG/Twitter. Премахнат meta keywords.
- Запазен оригиналният page-hero/header/footer/mobile bar и общите style.css/main.js. Само нов scoped assets/css/dobrich.css: пренасяне на CTA, четими стъпки/карти/FAQ, focus от наличния home.css, постоянно видима оригинална тройна контактна лента на мобилен екран.
- Добавени checklist за заявка, оферта без тарифи/диапазони, оборудване без недоказани числа, местна ориентация без пътни номера, Google профил/отзиви, шест компактни service карти и един FAQ с осем въпроса.
- Повторно използвани home.css/home.js и съществуващият opt-in диалог: два location бутона; SMS/копиране само след изрично действие. Няма нова интеграция за Viber/WhatsApp; съществуващите връзки са запазени.
- Премахнати двата стари FAQ блока/схеми и footer SEO секцията, вътрешният SEO label, 30-минутни обещания, липса на нощни такси, грешна география/20km радиус, универсално обслужване на тежки автомобили и неподкрепени технически числа.
- BG schema: Service за Добрич с areaServed City и provider → /#business; BreadcrumbList; един FAQPage за видимите осем въпроса. Няма отделна local business entity, geo, цени или рейтинги на тази страница. index.html получава само business @id и anchor „Пътна помощ Добрич 24/7“ — без друга homepage промяна.
- EN еквивалентът получава само фактологична/техническа консистентност: премахнати география/30min/heavy гаранции, Service към същия бизнес, един синхронизиран FAQ; logo link към EN home. Не е пълен английски content rebuild.
- Връзки към repatrirane, kran, podavane-na-tok, smqna-na-guma, transportni-uslugi, mikrobusi, agri transport, avto-klyuchar и съществуващите /#tehnika, /#galeria, /#kontakt, /#raioni. Varna/Balchik връзките вече са в main. Не са добавени линкове към несъществуващи case/contact/equipment страници.
- Празна редакционна структура tools/cases/dobrich.json и read-only renderer tools/cases/render-cases.mjs + README. Публикува се само след одобрение, данни/права и интеграция в обозначения слот. Празният набор връща празен HTML — няма измислени случаи.
- Hero използва наличния jalt-kamion-patna-pomosht-sisi.jpg (324,037 bytes вместо 2,236,834 PNG, приблизително 86% по-малък ресурс); equipment снимката е наличният crane JPG. Размери 1122×1402, high priority/preload за hero, lazy/async под първия екран. Оригиналите не са променяни. Това не е измерен LCP/CWV score; произход/права/конкретни задачи остават owner gate.
- .vercelignore допълнен само с архитектурния и новия вътрешен одит. Не е извършен upload.

### Проверки

- PASS: tools/check-seo.py — 30 страници, 0 нови грешки, 7 останали duplicate FAQ находки на ДРУГИ местни страници.
- PASS: tools/check-dobrich.py — strict tag nesting BG/EN, един Service/FAQ graph, текстово съвпадение на всички 8 BG и 4 EN FAQ отговора, телефонни href, изображения/dimensions, липса на footer section/забранени стари твърдения.
- PASS: snapshot сравнение — 89 други предсъществуващи файла byte-identical; началната се различава само по @id и линк anchor. Общите CSS/JS, sitemap, robots и всички оригинални активи са запазени.
- PASS: 30/30 HTML директни HTTP 200 + byte match; контролен несъществуващ URL →404; 29/29 CSS/JS/image HTTP проверки на static localhost:8782.
- PASS: node tools/check-home.mjs — BG/EN × iOS/Android mocked location/SMS/clipboard/permission/timeout/late callback tests. Не е вземана реална локация и не е изпращано съобщение.
- PASS: case renderer връща празен output при [] и отхвърля incomplete approved records; JS syntax и git diff --check.
- Google profile short link: HTTP 302→200; идентичността е проверена в предходната фаза. Няма ново извличане/вграждане на рейтинг.
- Safari: видим desktop първи екран и отваряне/затваряне на location dialog. След това собственикът използва същия браузър; не продължаваме да пречим с UI управление. Добавено е локално пренасяне на CTA след визуалния преглед; то още изисква повторна визуална проверка.
- NOT COMPLETE: 360/390/768/1440 визуална матрица, измерен overflow/contrast/CLS/LCP, реален SMS handoff и пълен keyboard/browser regression. agent-browser CLI липсва; Chromium fallback е блокиран от macOS MachPort permission denied. Не се заобикаля sandbox.
- Няма project build script — статичен сайт; опасният стар генератор не е изпълняван. Системният tidy е стар HTML4 parser (не разпознава header/svg/nav); НЕ е отчетен като HTML5 validation PASS. Няма външен Schema Validator/Rich Results PASS; има локални JSON/type/reference/content проверки.

### Owner input, рискове и следваща стъпка

Нужни: актуално 24/7 приемане и канали; own/partner услуги; товароносимост и кранова диаграма; реално покритие/ценови и нощни условия; документиран случай с 2–5 разрешени снимки. Заявените в сайта услуги/часове са запазени като съществуваща бизнес информация, не независимо удостоверена оперативна възможност.

Отделянето на локалния intent и премахването на дублираните блокове подобряват яснотата на основния Dobrich URL, но не доказват отстранена канибализация или бъдещо №1. Останалите местни/услужни страници и homepage schema още имат исторически фактически/schema рискове; не са преработвани извън разрешения обхват. Преди release: owner преглед, пълен mobile QA и отложеният Vercel routing/preview тест. Следваща одобрена фаза: шестте основни service страници поотделно. **STOP — без автоматична Фаза 5.**

### Последна корекция — връщане на предишния дизайн по искане на собственика

След обратна връзка за нежеланата промяна на мобилния изглед и изрично „da“ е възстановена оригиналната адаптивна HTML структура на BG/EN началните от резервното копие преди Фаза 2. Това връща оригиналния дизайн и на широк екран, понеже се използва общата оригинална структура, а не две дублирани версии на съдържанието. Премахнати са визуалните overrides от home.css; запазени са само location dialog и focus стиловете. Върнати са оригиналните hero, компактни карти, header, FAQ и тройна контактна лента.

Запазени: SEO head от Фаза 2, canonical/hreflang, актуализираният H1, коригираните обещания за време, премахнатият остарял aggregate rating, Google профилът и opt-in SMS диалогът. Оригиналните style.css, main.js, снимки и вътрешни страници не са редактирани. Source SEO: 30 страници, 0 нови грешки; location mock тестовете остават PASS. Няма deploy. Предишният отчет за новия визуален дизайн по-долу е исторически, не описание на текущия изглед.

**Фази 1 и 2 са реализирани локално; Phase 3 — SEO Information Architecture — COMPLETE (само планиране). Пълните приемателни проверки преди публикуване още не са приключили.** Фаза 2 е разрешена с „davai“ и „davai dovurshi zadachata sega“. Фаза 3 е разрешена с последното приложено planning-only задание. Фаза 4 не е започната. Няма commit, push, preview/production deploy или промяна на DNS/GBP.

## Phase 3 — SEO Information Architecture — COMPLETE

Създаден `SEO_INFORMATION_ARCHITECTURE.md` с 19 основни раздела: текущ/целеви sitemap, пълен инвентар, индивидуална оценка на местните URL, услуги и условни консолидации, keyword ownership, 12 briefs, case template, clusters, internal links, navigation, trust/schema/URL политика, приоритети и owner input.

- Анализирани 30 съществуващи HTML страници: 21 BG + 9 EN. Прочетени планът и журналът; проверени локалните заглавия, съдържание, schema, снимки и вътрешни връзки. Няма ново измерване на позиции, search volume или доказана причина за исторически спад.
- Главен архитектурен проблем: припокриване на начална/Добрич/репатриране/транспорт и слаба доказателствена основа за местните обещания. Съществуват service↔city връзки; не се твърди, че сайтът е напълно плосък.
- Предложени 20 запазени BG търговски URL = 8 местни + 12 услуги; първо ядро 7 = Добрич + 6 основни услуги. KEEP адрес не означава потвърдена услуга или достатъчно силно съдържание.
- 12 полезни ресурса = 11 статии + 1 общ pricing документ, без написани статии. 0 безусловни нови service pages, 0 нови city pages. Строителна техника остава само условен кандидат след доказателства.
- Силистра: conditional review/noindex/redirect candidate; Кранево: conditional consolidation later. Никакво noindex/301 действие без реално покритие, GSC, backlinks и релевантен target.
- Google профилът вече е предоставен и не се иска повторно. Липсват технически спецификации, действителни зони/задачи/снимки, правила за цена/нощ/реакция, NAP режим и GSC/lead данни.
- Актуалната официална Google документация отразява оттегляне на FAQ rich results през май 2026; планът не обещава такива резултати. Източници са цитирани в архитектурния документ.
- Запазен оригиналният адаптивен дизайн. Променени са само новият архитектурен документ и този журнал; всички останали файлове са защитени с before/after SHA-256 проверка.

### Нова номерация и следваща стъпка

Последното задание заменя старото значение на Фаза 3 в `SEO_REBUILD_PLAN.md`: тук тя е само архитектура. Препоръчана **Фаза 4: първо Добрич + EN еквивалент**, после отделно одобрени партиди за шестте основни услуги, без redesign или URL миграция. Старите бележки за „Фаза 3 — rewrite Добрич“ и STOP-ове по-долу са исторически, не текущо разрешение за работа.

Преди бъдещ deploy архитектурният документ трябва да бъде изключен от публикувания пакет: сегашният .vercelignore изброява само предишните два SEO документа. В тази planning-only фаза hosting конфигурацията не е редактирана.

**STOP след планирането. Фаза 4 изисква изрично одобрение.**

## Фаза 2 — начална страница и контакт

- Променени само BG/EN началните: бранд СИСИ + регионален обхват, нов първи екран, телефон и местоположение като основни действия, услуги, покритие и връзки към съществуващите местни страници.
- Запазени оригиналните медийни файлове, 8 BG услуги, 10 галерийни изображения, техника и услугата с комби. Новият слой е само `assets/css/home.css` и `assets/js/home.js`; общите CSS/JS и 28-те вътрешни страници са непроменени спрямо края на Фаза 1. Следвани са насоките на Sites за запазване на съществуващата технология и активи.
- Премахнати непотвърдените обещания „до 30 минути“ от началните и старият фиксиран рейтинг/брой 41. FAQ отговорът и BG FAQ schema са съгласувани. Премахнат само aggregateRating на началните; по-широкият schema rebuild остава за Фаза 5.
- Собственикът предостави `https://share.google/nfyszpwGISBmeHkoz`. Проверено в Safari: Пътна Помощ-Добрич, същите сайт/телефон и идентификатор като съществуващата карта. Добавено на BG/EN като линк към Google профил/отзиви, без фиксиран брой.
- Native FAQ details; езиков навигатор, достъпен focus, постоянно видими контактни действия на малки екрани. Локация: изрично действие за GPS, отделно действие за SMS/копиране, обработка на отказ/timeout, изчистване при затваряне. Няма автоматично изпращане.
- Резервно копие преди редакциите: `../seo-phase2-before-2026-09-16.tgz`.

### Проверки на Фаза 2

- `python3 tools/check-seo.py`: PASS, 30 страници, 0 нови грешки; остават 8 известни duplicate FAQPage на вътрешни страници за следващите фази.
- `node --check assets/js/home.js` и `node tools/check-home.mjs`: PASS. Mock тестове BG/EN × iOS/Android, SMS URI, clipboard/fallback, отказ/timeout, липсващ GPS, late callbacks и focus/reset. Не е използвана реална геолокация и не са изпращани SMS.
- HTML nesting на двете начални: PASS. Сравнение с tar snapshot: 86 други source/asset файла byte-identical, включително всички 28 вътрешни HTML и общите CSS/JS; AppleDouble metadata изключена от сравнението.
- Safari: BG/EN зареждат; визуално проверен наличният прозорец около 768px, BG меню → Услуги, location dialog → Escape и връщане на focus.
- Пълна матрица 360/390/768/1440, Lighthouse и real-device SMS handoff НЕ са отчетени като PASS. agent-browser CLI не е наличен; използван е Safari fallback. Преди release остава пълен responsive/интерактивен QA и непроведеният preview routing QA от Фаза 1.
- Работещ локален preview: `http://127.0.0.1:8782/`; старият 8765 отказва връзката и не е спиран/заменян.

**STOP след Фаза 2.** Следва Фаза 3 само след одобрение; никаква публикация по подразбиране.

## Фаза 1 — реализирани промени

### Актуализация — тестовата публикация е отложена (2026-09-16)

След първоначално разрешение за Vercel preview, потребителят поиска тази стъпка да се пропусне. Не е извършен deploy. Проверката на достъпа установи невалидна CLI сесия; започнатият вход е спрян, без натискане на Allow Access от агента. Не се прави production публикация като заместител на preview. Досегашните локални резултати остават валидни, а непроведените проверки не са маркирани като PASS.

При подготовката е добавен `.vercelignore`, който изключва вътрешните SEO отчети, maintenance scripts и служебните папки от бъдещ upload. Това е още един нов локален файл (общо 40 засегнати/нови спрямо baseline), без промяна на публичното съдържание. Фаза 2 остава за изрично одобрение.

- Предпочитан BG homepage: `https://www.putnapomoshtsisi.com/`.
- Всички 30 HTML страници: www/HTTPS canonical, съществуващи OG и JSON-LD URL стойности, hreflang и вътрешни начални връзки са съгласувани. Запазени са URL пътищата на всички услуги/градове, включително отделният self-canonical на Добрич.
- EN началната остава `/en/index.html`. В `vercel.json` има само две точни 301 правила: `/index.html → /` и `/en/ → /en/index.html`. Няма wildcard, cleanUrls, framework/build override или домейн/DNS настройка.
- 8 действителни BG/EN двойки са взаимни и еднакви в HTML/XML. `x-default` остава само за двете начални страници. Премахната е несъответстващата BG alternate връзка на `en/contact.html`; страницата и видимият езиков навигатор се запазват.
- `sitemap.xml` съдържа всичките 30 предпочитани URL. Премахнати са еднаквите, непотвърдени `lastmod` дати, без да се измисля дата на обновяване. Google препоръчва точни и проверими стойности за това поле: [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- `robots.txt` сочи www sitemap; crawling не е блокиран. В `llms.txt` са променени само URL референциите.
- `tools/generate-site.mjs` спира с ясна грешка преди всяко записване. Остарелите шаблони се пазят, но не трябва да се използват за production build. Не е регенериран сайтът.
- Нови тестове: `tools/check-seo.py` и `tools/check-routing.py`, без допълнителни зависимости.

### Точни засегнати файлове

30-те HTML файла са изброени по име в `SEO_REBUILD_PLAN.md`, раздел „URL-only промени по малки групи във Фаза 1“. Другите променени versioned файлове са `sitemap.xml`, `robots.txt`, `llms.txt`, `tools/generate-site.mjs` — общо 34.

Нови файлове спрямо baseline: `vercel.json`, `tools/check-seo.py`, `tools/check-routing.py`, `SEO_REBUILD_PLAN.md`, `SEO_REBUILD_PROGRESS.md`. Последните два са започнати във Фаза 0 и обновени във Фаза 1.

Не са променени CSS, runtime JS, оригиналните изображения, H1/title/description текстове, FAQ съдържание, телефон, адрес, оценки или социални идентификатори. JSON-LD промяната е само URL нормализация; общ business `@id` модел и schema преструктуриране остават за Фаза 5.

### Фаза 1 — проверки и реални резултати

| Проверка | Резултат |
|---|---|
| Source SEO + сравнение с `0b9b2ec` | PASS: 30 страници, 0 нови грешки; 10 изрично отложени находки |
| Защита срещу промяна на съдържание | PASS: body без href стойностите е идентичен; title/meta/schema бизнес данните са запазени; link destinations, fragments и query са запазени; останалите versioned активи са byte-identical |
| Самопроверка на checker-а | PASS: 5 in-memory отрицателни теста засичат грешен canonical, променен title, счупен anchor, променен query и дублиран hreflang; без файлови редакции |
| Реален `vercel dev --local` | Стартира успешно с CLI 59.16.0, без project link/deploy; `CHOKIDAR_USEPOLLING=1` за локалния watcher |
| HTTP през Vercel dev | **52/78 PASS, 26 FAIL**; не се отчита като пълен routing PASS |
| Всички 30 предпочитани страници | 30/30 директни 200, HTTP телата съвпадат с локалния кандидат |
| Двата alias redirect-а, GET + HEAD без query | 4/4 PASS: 301 → директно 200, без loop |
| Отрицателни URL / Dobrich | 4 контролни несъществуващи адреса → 404; Dobrich и двете начални → директно 200 |
| Query запазване при redirect | 8 FAIL във Vercel dev: UTM, повтарящи се ключове, кодирана кирилица, празна стойност и плюс; нужен одобрен preview тест |
| Ресурси с кирилски пътища във Vercel dev | 18 FAIL с 404; същите неизменени файлове са достъпни на живия сайт и през обикновения локален server |
| Всички използвани CSS/JS/изображения — отделна контрола | 26/26 PASS на live и 26/26 PASS на static localhost; byte-identical с локалните файлове |
| Генератор guard | PASS: изпълнен от нова празна временна папка, exit 1 с очакваното съобщение, 0 създадени файла |
| JS синтаксис / diff | PASS: `node --check` за runtime JS и генератора; `git diff --check` |
| Production build / deployed edge | NOT RUN: няма разрешение за публикация; това е static HTML repo, без npm build. Dashboard build command не е независимо потвърден |
| Визуален/интерактивен mobile QA | NOT COMPLETED: автоматичният Chromium остава блокиран от macOS sandbox; няма нови screenshot, responsive или CTA PASS доказателства |

10-те отложени source находки са 8 съществуващи duplicate FAQPage и 2 review placeholder anchors. Те не са нови регресии и не са маркирани като поправени.

### Защо не добавих допълнителен redirect механизъм

Официалната документация казва, че стандартните `vercel.json` redirects пренасят query параметрите автоматично. Локалният CLI не го направи; прегледът на неговия `sendRedirect/exitWithStatus` код също показва изпращане на Location без прикачване на query. Това е наблюдавано разминаване между dev и документираното поведение, **не доказан успешен production тест**. Конфигурацията остава минимална и следва официалния формат. [Vercel query strings](https://vercel.com/kb/guide/how-do-i-perform-vercel-redirects-based-on-query-strings).

Не е добавен middleware/нов runtime или bulk redirects само за да стане локалният тест зелен. Bulk redirects изискват Pro/Enterprise и не са необходими за два адреса. [Vercel bulk redirects](https://vercel.com/docs/routing/redirects/bulk-redirects).

### Deployment baseline и оставащи release проверки

Read-only `vercel inspect` потвърди проект `putna-pomosht-dobrich`, production deployment `dpl_8LzUbtJusV8dL2vEzUwscXWfhDYj`, build entrypoint `.`, `@vercel/vc-build`, Node 24.x, празен versioned vercelConfig. Aliases включват www и non-www домейна. Отделният project-inspect CLI опит се провали; точните Dashboard Build/Output settings остават за потвърждение преди release.

1. Само след разрешение: тестова Vercel публикация, без promotion към production; повторение на всички 78 HTTP теста. Query/кирилски ресурси трябва реално да преминат, не да се игнорират.
2. Проверка на действителните build/root настройки, така че старият генератор да не е build command.
3. Responsive/interactive QA в достъпен браузър: 360/390/768/1440, навигация, езикова смяна, anchors, gallery, CTA без реално обаждане или изпращане на местоположение.
4. След отделно одобрение на release: WWW/HTTPS и index матрица срещу живия домейн. Текущата HTTP apex → HTTPS apex → www верига е домейнен слой; не е променена. Премахването ѝ може да изисква отделна Vercel Domains настройка, не е обещано чрез HTML.

### Възпроизводими команди

От директорията на repo:

```sh
python3 -B tools/check-seo.py --phase1-baseline 0b9b2ec
CHOKIDAR_USEPOLLING=1 VERCEL_TELEMETRY_DISABLED=1 vercel dev --local --listen 127.0.0.1:8770 --non-interactive
python3 -B tools/check-routing.py --base-url http://127.0.0.1:8770
python3 -B tools/check-routing.py --base-url https://www.putnapomoshtsisi.com --assets-only
node --check assets/js/main.js
node --check tools/generate-site.mjs
git diff --check
```

Routing checker-ът връща exit 1 при горните dev отклонения, умишлено. За preview тест се заменя само base-url с изрично одобрения preview origin. Python server на 8765 може да показва статичния сайт, но не симулира Vercel redirects.

Evidence извън production repo: `../seo-phase1-validation-2026-09-16.json` — source резултат, HTTP редове и hashes, live/static asset контрола, отрицателни тестове и generator guard. Baseline от Фаза 0 не е презаписан.

### Rollback / следваща стъпка

Промените са само локални и не изискват rollback на живия сайт. При отказ от тази кандидатура се възстановяват само конкретните 34 променени файла от `0b9b2ec` и се премахват/архивират само изброените нови файлове след преглед за последващи потребителски редакции. Не се използва destructive reset.

Преди бъдеща публикация се записва тогавашният production deployment ID; горният ID е исторически ориентир, не гаранция за последната версия към бъдеща дата.

**STOP след Фаза 1.** Реализацията е локална; release QA остава условие за пускане. Следващата продуктова фаза е Фаза 2 — начална страница и CRO — само след изрично одобрение.

---

## Архив: резултати от Фаза 0 (2026-09-15)

Следващите секции описват състоянието преди Фаза 1, не текущия локален код.

## Създадени файлове

- `SEO_REBUILD_PLAN.md` — обхват, поетапен план и ограничения.
- `SEO_REBUILD_PROGRESS.md` — този журнал.

Production код, URL адреси, настройки на хостинга и бизнес профили: без промени.

## Изходна точка

Commit `0b9b2ec5c1b5e4ded54616b1786a303d22ff4848`; чисто работно дърво преди създаването на документите.

## Тестове и проверки

Прочетени са изцяло двата предоставени текста. Потвърдени са местоположението на хранилището, клонът и изходният commit.

| Проверка | Резултат |
|---|---|
| Инвентар и архитектура | 84 versioned файла; 30 HTML = 21 BG + 9 EN; static HTML/CSS/JS; няма package/build/deployment config в Git |
| Локален сървър | Съществуващият server на `http://127.0.0.1:8765/` е достъпен. 30 HTML + `/` → 200 |
| Live URL matrix | 40 уникални GET проверки; всички достигат 200, след записаните redirects |
| Sitemap срещу live | Всички 30 адреса достигат 200; HTML телата съвпадат byte-for-byte с локалните |
| Homepage варианти | HTTP/HTTPS × www/non-www × root/index проверени; HTTP apex има 2 hops; www `/` и `/index.html` са отделни 200 отговори с еднакви байтове |
| Допълнителни HEAD | `/en/` → 200; Dobrich без `.html` → 404; контролен липсващ адрес → 404 |
| H1/main/metadata | По 1 H1/main в source; уникални title/description; self-canonical и index/follow на всички 30 |
| JSON-LD | Няма JSON parse грешки. 8 BG местни страници с по 2 FAQPage; това не е Rich Results validation |
| Локални препратки/ID | 0 липсващи проверени локални ресурса; 0 дублирани ID; 2 broken anchors към review TODO |
| Hreflang | 8 взаимни BG/EN двойки; `en/contact.html` → BG homepage няма обратна съответстваща връзка |
| Footer | На 8 BG местни страници `section.content-section` е във footer и има видим production label |
| Изображения | Няма липсващ alt атрибут; 15 празни = 14 икони (12 с aria-hidden, 2 за визуална проверка) + динамичен lightbox img. Hero + logo ~3.06 MB; без srcset |
| JavaScript syntax | `node --check assets/js/main.js` и `node --check tools/generate-site.mjs` PASS; генераторът не е изпълняван |
| Автоматичен browser QA | BLOCKED: Chromium не стартира заради macOS MachPort sandbox. Не са изпълнени планираните 360/390/768/1440 и интерактивни тестове |
| Lighthouse/реални CWV | Не са измерени във Фаза 0; не се съобщава скоростен score |
| Production diff | Не се променят versioned source файлове; само двата нови документа в repo |

### Възпроизводими доказателства извън production repo

- `../seo-phase0-baseline-2026-09-15.json`: SHA-256 манифест, на-страница source metadata/schema/изображения, live redirect matrix и local HTTP резултати.
- `../../work/seo_phase0_baseline.py`: read-only checker, генерира горния JSON извън repo. Python 3.9 обработката на 308 беше адаптирана след първия тест; първоначалните 308 „errors“ бяха ограничение на checker-а, не сайт 4xx/5xx. Окончателният повторен тест е 40/40 крайни 200.
- `../../work/seo_phase0_browser.cjs`: подготвен визуален/интерактивен baseline, но изпълнението е блокирано; няма успешно създаден `results.json` или screenshot доказателства от този run.
- Предишният одит е в `../seo-design-audit-sisi-2026-09-15.md`. При разминаване използвайте точните числа от текущия baseline; 21 BG/9 EN, JS 6712 байта, CSS 90 795 байта.

Не са извършвани обаждания, SMS, геолокация на потребителя, външни съобщения, GBP редакции, commit, push или deploy.

## Нужни данни от собственика

- Действителен публичен адрес/режим на обслужван район и потвърдени координати.
- Проверени Google Business Profile/review адреси и актуалност на оценката.
- Search Console query × page базова серия и период на наблюдавания спад.
- Оперативни условия, цени/нощна политика, действително обслужвани маршрути и реални случаи.
- Потвърждение кой Vercel проект/production root обслужва домейна и дали има dashboard build/redirect правила.
- Документирани ограничения на платформата/крана, разрешителни за публично цитиране и права за снимките.

Външният доклад не е независимо потвърждение за Google update, исторически ранг, санкция, точен business pin или актуална оценка. Различните юридически и оперативни адреси не се сливат автоматично.

## Рискове и възстановяване

Старият генератор може да презапише текущите HTML и SEO файлове; не се изпълнява. Фаза 0 добавя само документи и не изисква възстановяване на production код. Документите могат да бъдат преместени извън хранилището, ако собственикът не желае да ги запази.

За бъдещи фази: всяка одобрена партида се пази отделно; преди release се записва deployment ID за връщане. Възстановява се само конкретната одобрена промяна, а не цялото работно дърво с destructive reset. Оригиналните медийни активи се запазват. Snapshot на commit и SHA-256 baseline позволява сравнение, но не заменя production rollback процедурата.

## Следваща стъпка

Предаване на доклада от Фаза 0 и спиране. Фаза 1 започва само след изрична следваща инструкция след този доклад. Предложението е подробно в `SEO_REBUILD_PLAN.md`, раздел 5: безопасност на генератора → homepage/URL правила → малки групи URL-only редакции → hreflang/SEO файлове → проверки → STOP.

Без rewrite на Добрич, без redesign, без business address промяна, без mass redirects и без production deploy във Фаза 1 по подразбиране.
