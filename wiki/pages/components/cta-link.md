---
type: component
status: current
updated: 2026-08-11
tags: [ui, analytics]
sources: [architecture-doc]
code_refs:
  - src/components/ui/CtaLink.tsx
  - src/components/ui/Button.tsx
---

הרכיב שמחבר בין קליק לאירוע מדידה, ונשאר קישור אמיתי.

## הבעיה שהוא פותר

CTA צריך שני דברים סותרים לכאורה: להיראות ככפתור, ולהתנהג כקישור. אם ממשים אותו
כ‑`<button onClick={navigate}>` מאבדים לחיצה אמצעית, פתיחה בטאב חדש, תצוגה
מקדימה של היעד ו‑semantics של ניווט.

`CtaLink` הוא `<a>` אמיתי שיורה את האירוע ב‑`onClick` **בלי לחסום ניווט**.

## החלוקה מול `Button`

`Button.tsx` הוא רכיב שרת נקי: הוא מייצא `buttonClass()` ו‑`ButtonContent`,
כלומר **סגנון בלבד**. `CtaLink` הוא `"use client"` ומשתמש בהם.

הסיבה: אילו האנליטיקס היו בתוך `Button`, כל כפתור באתר היה הופך לרכיב לקוח.
כך רק הקישורים שבאמת מודדים משלמים במחיר הידרציה. ראו [[performance-budget]].

## חובת placement

`placement` הוא prop **חובה**, לא אופציונלי. זו האכיפה בפועל של
[[analytics-contract]] — אי אפשר להוסיף CTA ולשכוח לתייג אותו.

## קישורים חיצוניים

`external` ברירת מחדל `true`, ומוסיף `target="_blank" rel="noopener noreferrer"`
רק אם ה‑href הוא `http(s)`. לכן `mailto:` נשאר באותה לשונית — נכון, כי פתיחת
לקוח דוא"ל בטאב חדש משאירה טאב ריק.

## קשור

[[design-system]] · [[download-options]]
