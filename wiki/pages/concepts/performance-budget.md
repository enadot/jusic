---
type: concept
status: current
updated: 2026-08-11
tags: [performance, budget]
sources: [architecture-doc]
code_refs:
  - src/app/page.tsx
  - next.config.ts
---

תקציבי ביצועים שהאתר נמדד מולם, והבחירות הארכיטקטוניות שנועדו לעמוד בהם.

## התקציב

| מדד | יעד | מצב |
| --- | --- | --- |
| Initial JS | < 150 kB gz | **119 kB** |
| LCP | < 2.0s | טרם נמדד |
| INP | < 200ms | טרם נמדד |
| CLS | < 0.05 | טרם נמדד |

## מה שומר על המספר

- **RSC כברירת מחדל.** `"use client"` רק על עלים שבאמת אינטראקטיביים:
  `SiteHeader`, `Faq`, [[reveal]], [[cta-link]], `StickyCta`, [[download-options]],
  `UtmCapture`.
- **אין ספריית אנימציה.** הבריף אישר Framer Motion; בפועל היא לא נדרשה, כי
  ה‑reveals הם CSS + `IntersectionObserver`. חיסכון של עשרות kB על אפקט אחד.
- **משפחת פונט אחת**, self‑hosted, `swap`.
- **אין סקריפט צד‑שלישי** — ראו [[analytics-contract]].
- `next/image` בכל מקום; `priority` רק על ה‑Hero.

## מקרה מלמד

`Reveal` משמש גם כטריגר ל‑`section_view`, כדי לא להריץ `IntersectionObserver`
שני על אותם אלמנטים. חיסכון קטן, אבל הוא מדגים את העיקרון: **אפקט קיים משמש
כמנגנון מדידה במקום להוסיף מנגנון חדש.**

## קשור

[[design-system]] · [[build-clobbers-dev-server]]
