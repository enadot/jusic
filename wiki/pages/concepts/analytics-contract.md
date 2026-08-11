---
type: concept
status: current
updated: 2026-08-11
tags: [analytics, measurement, kpi]
sources: [architecture-doc]
code_refs:
  - src/lib/analytics.ts
  - src/components/shared/UtmCapture.tsx
---

ממשק מדידה יחיד שכל האתר עובר דרכו, ללא תלות בספק.

## החוזה

```
track(event, { placement, ...params })
```

- **`AnalyticsEvent` הוא union סגור.** הוספת אירוע היא שינוי טיפוס, ולכן אי אפשר
  לירות בטעות אירוע שלא הוגדר או לשגות בשם.
- **`placement` הוא חובה** — `hero | platforms | cta | footer | sticky | header |
  download | faq`.
- UTM נקלטים פעם אחת לסשן ל‑`sessionStorage` ומצורפים אוטומטית לכל אירוע.

## למה placement הוא חובה

ה‑KPI של האתר הוא שיעור המרה מביקור ← לחיצת התקנה/האזנה. אותו CTA מופיע בארבעה
מקומות שונים. בלי `placement` יודעים *שמישהו לחץ להורדה* אבל לא *איזה מיקום גרם
לזה* — וזו בדיוק השאלה שהאתר קיים כדי לענות עליה.

## אין ספק מחובר

`dispatch()` בוחר יעד בזמן ריצה: `dataLayer` → `gtag` → בפיתוח `console.info`.
**לא נטען שום סקריפט צד‑שלישי.** זו לא השמטה — היא עומדת בדרישת הביצועים
([[performance-budget]]) ובדרישת ההסכמה לקוקיז. חיבור ספק = שינוי בפונקציה אחת.

## איפה זה נפגש עם ה‑UI

[[cta-link]] הוא הרכיב היחיד שמחבר בין קליק לאירוע.

## קשור

[[download-logic]] · [[performance-budget]]
