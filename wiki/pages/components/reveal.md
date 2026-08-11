---
type: component
status: current
updated: 2026-08-11
tags: [ui, motion, analytics]
sources: [architecture-doc]
code_refs:
  - src/components/ui/Reveal.tsx
  - src/styles/globals.css
---

עוטף שמפעיל את אנימציית הכניסה בגלילה, ומשמש גם כטריגר ל‑`section_view`.

## למה CSS ולא ספריית אנימציה

האנימציה עצמה (`.rv` → `.rv.in`) חיה ב‑CSS. הרכיב **רק מוסיף class**.

שני רווחים:

1. `prefers-reduced-motion` מבטל את האפקט ב‑CSS, כלומר האנימציה נעלמת גם אם
   ה‑JS כבר רץ. אין תלות בלוגיקה שתזכור לבדוק העדפה.
2. אין ספריית אנימציה בבאנדל. ראו [[performance-budget]].

## שני תפקידים, observer אחד

אותו `IntersectionObserver` שמפעיל את הגילוי יורה גם `section_view`
([[analytics-contract]]), במקום להריץ observer שני על אותם אלמנטים.

## המלכודת: תוכן שמתחיל שקוף

`.rv { opacity: 0 }` פירושו שבלי JS **התוכן לא נראה**. ה‑HTML קיים לזחלנים,
אבל אדם עם JS חסום היה רואה עמוד ריק.

הפתרון: `<noscript><style>.rv{opacity:1;transform:none}</style></noscript>`
ב‑layout. זה כלל כללי — **כל אפקט שמסתיר תוכן כברירת מחדל חייב fallback ב‑noscript**.

## קשור

[[accessibility]] · [[design-system]]
