# Реални случаи — редакционен компонент

Не е runtime CMS и не публикува автоматично. Празният набор за Добрич не създава секция или линк. Изпълнете `node tools/cases/render-cases.mjs` за HTML preview в stdout; след одобрение поставете резултата между DOBRICH_CASES_START/END с apply_patch и пуснете SEO/HTML тестовете.

В dobrich.json добавяйте само документирани записи: title, location, vehicleType, problem, solution, equipment, period, relatedService (съществуващ HTML файл), photos (2–5 src/alt/width/height), verificationReference, reviewedBy, publicationPermission, approved. Последните две са true само след собственик/редактор. Вътрешните verificationReference/reviewedBy не се рендерират.

Проверете снимките за права, лица, номера и лични данни; не използвайте AI изображения като доказателство за извършена работа. Проверете локалните файлове и услугата преди интеграция. Без измислени sample записи, цени, дати или клиентски цитати. tools/ е изключен от upload чрез .vercelignore.
