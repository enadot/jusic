---
type: decision
status: current
updated: 2026-08-11
tags: [cms, architecture, scope]
sources: [architecture-doc]
code_refs:
  - src/content/site.ts
---

**החלטה:** לא לבנות Sanity בשלב זה. כל התוכן יושב במודול TypeScript אחד.

## הרקע

הבריף מחייב Sanity v3 עם Embedded Studio, סכמות, typegen, Live Content ו‑Draft
Mode — שניים מתוך שמונה מיילסטונים. הלקוח בחר להגיע לאתר חי מהר יותר.

## איך זה נשמר הפיך

זה לא "לדחות ולשלם אחר כך", בתנאי אחד: **המבנה של `site.ts` נקבע לפי הצורה
שהנתונים יקבלו ב‑Sanity**, ולא לפי מה שנוח לרכיבים.

כל export מתאים אחד‑לאחד למסמך או ל‑section object עתידי. הרכיבים צורכים ערכים,
לא קבצים. לכן המעבר הוא החלפת פונקציות שמחזירות את אותם טיפוסים.
ראו [[content-model]].

## מה נדחה יחד עם זה

- ניהול תוכן ללא מפתח.
- עמודי נחיתה `/l/[slug]` לקמפיינים.
- `downloadLinks` כ‑singleton, כולל הדלקה/כיבוי של כפתור ה‑APK מהממשק
  ([[d-005-apk-interim-link]]).

## תנאי ההיפוך

`projectId` + `dataset` מהלקוח, ובקשה מפורשת. רשום ב‑`docs/OPEN_ITEMS.md` #13.

## קשור

[[open-questions]]
