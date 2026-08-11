---
type: component
status: current
updated: 2026-08-11
tags: [rtl, tooling, quality-gate]
sources: [architecture-doc]
code_refs:
  - scripts/check-rtl.mjs
---

שער איכות שמכשיל את הבילד על כל שימוש בכיווניות פיזית. המימוש של [[rtl-policy]].

## איך הוא עובד

סורק `src/**/*.{ts,tsx,css}` ומחפש דפוסים אסורים. הוא מתאים **טוקנים שלמים**
ולא תת‑מחרוזות — אחרת `overflow-x-hidden` או `border-e` היו מדווחים בטעות.

ב‑CSS הוא בודק גם מאפיינים: `margin-left`, `border-right`, `left:`,
`text-align: left`.

רץ כחלק מ‑`npm run lint`, לפני ESLint.

## פתח מילוט

הערת `rtl-allow` בסוף השורה מדלגת עליה. היא קיימת כי יש מקרים לגיטימיים
(למשל אלמנט שחייב להיצמד פיזית), אבל **היא דורשת נימוק בהערה** — אחרת היא הופכת
לדרך לעקוף את הכלל.

## מגבלה ידועה

הסקריפט בודק טקסט, לא AST. `className={cond ? "ml-4" : ""}` ייתפס, אבל מחרוזת
שנבנית דינמית משברי טקסט — לא. בפרקטיקה זה לא קרה, כי אין באתר בניית classNames
דינמית.

## קשור

[[rtl-policy]] · [[performance-budget]]
