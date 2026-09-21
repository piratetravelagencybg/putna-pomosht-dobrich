# Phase 4 — Dobrich audit and implementation notes

Baseline captured 2026-09-21 before editing; full recovery snapshot: ../seo-phase4-before-2026-09-21.tgz. No deployment authorized.

## Before-edit audit

- Title: Пътна помощ Добрич 24/7 | СИСИ ЕООД.
- Description: Пътна помощ Добрич 24/7 от СИСИ ЕООД. Репатриране, кран услуги, подаване на ток, смяна на гума и транспортни услуги с бърза реакция.
- H1: Пътна помощ Добрич 24/7. Index/follow; self-canonical https://www.putnapomoshtsisi.com/patna-pomosht-dobrich.html; mutual BG/EN alternates.
- Main headings: repeated H2 Пътна помощ Добрич 24/7; H3 Помощ на място или транспорт, Вижте също, Как помагаме най-често, Нужна ви е пътна помощ в Добрич?; FAQ H2; repeated contact H2.
- Footer wrongly contains substantive H2s Репатрак Добрич — бърза реакция при авария, Денонощна пътна помощ Добрич, Цени за пътна помощ Добрич, Вижте още, second FAQ and CTA. Four H3 questions repeat price/time/hours/vehicle topics.
- Schema: LocalBusiness without shared ID, unverified geo and broad Europe coverage; TWO FAQPage scripts; BreadcrumbList. No Service linking to central provider.
- Links: homepage anchors for services/equipment/regions/gallery/contact; repatrirane, kran, battery, tire; Varna/Balchik links in footer; EN equivalent. Phone/Viber/WhatsApp repeated hero/content/contact/footer/mobile bar. No location-sharing CTA on this page; no Google profile link.
- Service claims: repatriation, crane, battery, tire, locksmith, transport, winch, cars/vans/buses/trucks; combi mention. Unsupported universal heavy-vehicle claims and exact 5400 kg / 10.40 m / 6.0 × 2.55 m specs.
- Trust/assets: existing logo and fleet hero; same hero repeated below fold, not evidence of a specific Dobrich job. Hero PNG 2,236,834 bytes; high-priority preload; dimensions present. No documented real case, date/photo linkage, permissions or verified certificates.
- FAQ: two visible groups and two matching-but-duplicative schema groups; response promises repeated. Pricing: no night/weekend/holiday surcharge without evidence. Time: 30-minute claims in content, footer and schema.
- Geography: largest city in Northeast Bulgaria, E70 toward Varna, 20km radius, village list, local accident-frequency claims are unsupported/inaccurate. Remove, do not replace with guessed road numbers or cases.
- Visible internal label Локална SEO страница. Generic keyword/reliability repetition, copied sitewide footer claims.
- Shared implementation: static copied HTML; style.css supplies page-hero/content-grid/cards/FAQ/mobile bar. main.js handles menu/FAQ. Existing home.js supplies opt-in location dialog. Legacy generator is guarded and will not run.

## Evidence and owner gates

Existing service pages and site-wide 24/7 messaging support retaining the current declared services/hours, not a newly independently certified capability. Telephone and supplied Google profile are retained from Phase 2. No promise of immediate dispatch or guaranteed arrival is added.

OWNER_VERIFICATION_REQUIRED: confirm current 24/7 intake and monitoring of SMS/Viber/WhatsApp; own vs partner service delivery; dispatch/quote procedure. Public copy asks the user to call and provide information, not asserting an unverified dispatch sequence.

OWNER_VERIFICATION_REQUIRED: equipment payload, crane load/reach chart, dimensions, vehicle compatibility, automatic/EV procedures. Exact figures withheld on this page.

OWNER_FACT_CHECK_REQUIRED: real nearby service coverage and routes, tariff factors, night/holiday/VAT/waiting conditions, business legal/public-address details. No named village list, fixed prices or surcharge guarantees.

OWNER_CONTENT_REQUIRED: real Dobrich roadside assistance case with 2–5 photos, period, vehicle, problem, solution, equipment, service link and publication permission. Empty case data must render no public section, no placeholder jobs, no broken case links.

## Implementation policy

Retain original shared CSS/JS, adaptive hero/header/footer/mobile contact design and all existing URLs. Only scoped content/technical fixes, reusable opt-in location UI and unpublished case scaffold. BG is primary; EN receives factual/schema consistency cleanup only. Stable provider @id on homepage; local Service refers to it. No ratings/coordinates/local office invented. FAQ schema, if retained, must exactly follow the one visible FAQ.

Sources: https://schema.org/Service and https://developers.google.com/search/docs/appearance/structured-data/sd-policies (checked 2026-09-21). Schema should reflect visible content; no rich-result or ranking guarantee.
