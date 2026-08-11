---
type: topic
status: current
updated: 2026-08-11
tags: [tooling, gotcha, nextjs]
sources: [architecture-doc]
---

`npm run build` בזמן ש‑`npm run dev` פועל משבית את שרת הפיתוח.

## התסמין

השרת מתחיל להחזיר 500 עם:

```
Error: Cannot find module './331.js'
Require stack: .next/server/webpack-runtime.js
```

והדפדפן מציג עמוד ריק, למרות שהקוד תקין ו‑`npm run build` הצליח.

## הסיבה

שניהם כותבים לאותה תיקייה `.next`. הבילד דורס את ה‑chunks שהשרת החי מחזיק
בזיכרון, וה‑runtime שלו מפנה לקבצים שכבר לא קיימים.

## הפתרון

לעצור את ה‑dev → `rm -rf .next` → לבנות → להפעיל מחדש.

## למה זה שווה דף

הוא מתחזה לבאג בקוד. איבדנו על זה סבב אבחון שלם: ראינו עמוד ריק אחרי שינוי
CSS ובדקנו את ה‑CSS, כשהשגיאה בכלל הייתה בסביבה.

**האבחנה המהירה:** אם `npm run build` עובר אבל `dev` מחזיר 500 — זה זה.

## הערה על אימות

מאותה משפחה: כשהדפדפן לא מרכיב פריימים, `transition` נתקעת ו‑`getComputedStyle`
מחזיר ערך ביניים. זה נראה כמו באג צבע. ראו [[download-options]].

**הכלל:** לפני שמסיקים באג מבדיקה אוטומטית — לוודא שהסביבה עצמה תקינה.

## קשור

[[performance-budget]]
