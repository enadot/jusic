---
type: concept
status: current
updated: 2026-08-11
tags: [a11y, compliance]
sources: [architecture-doc]
code_refs:
  - src/app/legal/accessibility/page.tsx
  - src/styles/globals.css
---

תקן ישראלי ת"י 5568 ברמת WCAG 2.1 AA. זו דרישה רגולטורית, לא שאיפה.

## מה מיושם

- **Skip link** כאלמנט הראשון ב‑`<body>`.
- **Focus = טבעת, לא מילוי.** `#5FCEE5`, 2px, offset 2px, בכל אלמנט אינטראקטיבי.
- **FAQ על `<details>/<summary>` נייטיביים** — מקלדת ו‑semantics בחינם, בלי
  לממש accordion ידנית ובלי להמציא `aria` שעלול להיות שגוי.
- `aria-label` בעברית בכל פקד אייקון.
- `prefers-reduced-motion: reduce` מבטל את ה‑reveals ומאפס כל transition.
- `<noscript>` מכריח `.rv { opacity: 1 }` — ראו [[reveal]].

## הכלל שנוגס

**לבן על ציאן = 2.6:1 ונכשל בכל תקן.** מילוי ציאן נושא תמיד `#0F1417`.
זה נכשל בפועל פעם אחת בגלל [[tailwind-v4-layering-trap]] — הכפתור הראשי רונדר
ציאן‑על‑ציאן ביחס 1.17:1 עד שהתגלה.

## ניגודיות שנמדדה בדפדפן

| שילוב | יחס |
| --- | --- |
| CTA ראשי (`#0F1417` על ציאן) | 7.26:1 |
| טקסט משני | 9.97:1 |
| קישורי ניווט | 9.97:1 |
| שורת זכויות | 6.26:1 |

שורת הזכויות תוקנה מ‑`text-disabled` (3.89:1, נכשל) ל‑`text-tertiary`.
**המסקנה:** `--text-disabled` אינו בטוח לטקסט קריא בשום גודל.

## מה טרם נבדק

התנהגות תלוית‑גלילה לא אושרה ויזואלית. ראו [[open-questions]].

## קשור

[[design-system]] · [[rtl-policy]]
