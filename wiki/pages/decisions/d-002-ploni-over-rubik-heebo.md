---
type: decision
status: open
updated: 2026-08-11
tags: [typography, licensing]
sources: [architecture-doc]
code_refs:
  - src/app/layout.tsx
---

**החלטה:** להשתמש ב‑Ploni (Fontef) ולא ב‑Rubik/Heebo.

## הסתירה

הבריף מציע Rubik או Heebo מ‑Google Fonts. מערכת העיצוב מגדירה **Ploni**, וקבצי
ה‑WOFF סופקו בפועל.

## ההכרעה

Ploni. הבריף מציע ברירת מחדל סבירה כשאין פונט מותג; כאן יש פונט מותג, והקבצים
הגיעו. פונט מותג גובר על ברירת מחדל.

ארבעה משקלים אמיתיים (300/400/700/800) נטענים דרך `next/font/local`, כדי ששום
משקל לא ייווצר סינתטית.

## למה הסטטוס `open`

Ploni הוא פונט מסחרי של Fontef. **רישיון ה‑Web לשימוש בפרודקשן טרם אומת**, וקבצי
ה‑WOFF נמצאים כעת בריפו. אם הריפו יהפוך לציבורי, זו הפצה של פונט מורשה.

ההחלטה תעבור ל‑`current` כשהרישיון יאומת, או תוחלף אם יתברר שאינו מכסה שימוש
באתר. רשום ב‑`docs/OPEN_ITEMS.md` #10.

## קשור

[[design-system]] · [[open-questions]]
