---
type: decision
status: current
updated: 2026-08-11
tags: [icons, design, performance]
sources: [architecture-doc]
code_refs:
  - src/components/ui/Icon.tsx
---

**החלטה:** להשתמש ב‑`lucide-react` במקום Material Symbols Rounded שמערכת העיצוב
טוענת.

## הסתירה

מערכת העיצוב טוענת Material Symbols Rounded מ‑Google Fonts. הבריף מגדיר
`lucide-react`.

## ההכרעה, והנימוק

מערכת העיצוב **עצמה מסמנת את הבחירה הזו כתחליף**: לא סופק לה שום icon set, והיא
בחרה במה שדומה ביותר לגליפים שנראים בצילומי המסך, עם הערה מפורשת "אם האפליקציה
משתמשת בסט אחר — שלחו ונחליף".

כלומר זו לא החלטת עיצוב שאנחנו מפרים, אלא placeholder שהוזמנו להחליף.

בנוסף: פונט משתנה שלם של Material Symbols עבור תשעה גליפים סותר את
[[performance-budget]].

## המימוש

מיפוי אחד ב‑`Icon.tsx` משמות הגליפים של העיצוב לרכיבי lucide. יש מקום אחד לשנות
אם האפליקציה תספק את הסט האמיתי.

## חריג

ל‑Android אין גליף ב‑lucide — סמלי מותג הוסרו מהסט. הוא מומש כ‑SVG מוטבע.
זה **סמל פלטפורמה על כפתור חנות**, לא אייקון דקורטיבי, ולכן אינו סותר את הכלל
"אין SVG מצויר ביד" שב‑[[design-system]].

## קשור

[[d-002-ploni-over-rubik-heebo]]
