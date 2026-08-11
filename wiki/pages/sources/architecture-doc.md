---
type: source
status: current
updated: 2026-08-11
kind: live
tags: [documentation, foundation]
code_refs:
  - docs/ARCHITECTURE.md
---

התיעוד הטכני של `jusic.co` — מסמך המקור שממנו נזרע ה‑Wiki הזה.

## פרטי המקור

| | |
| --- | --- |
| סוג | `live` — נמצא בריפו וממשיך להשתנות; לא הועתק ל‑`raw/` |
| נתיב | `docs/ARCHITECTURE.md` |
| נקלט ב‑commit | `16ff258` |
| נכתב על ידי | הסוכן, בסוף בניית האתר |

## למה דווקא הוא ראשון

הוא כבר מכיל את הסינתזה של שלושת מקורות האמת של הפרויקט — הבריף, מסמך העיצוב
ומערכת העיצוב — יחד עם ההכרעות שנעשו בין סתירות שלהם. קליטה שלו נותנת ל‑Wiki
בסיס שלם בפעולה אחת, במקום להתחיל משלושה מקורות שסותרים זה את זה.

## מה חולץ

**מושגים:** [[design-system]] · [[rtl-policy]] · [[analytics-contract]] ·
[[content-model]] · [[accessibility]] · [[performance-budget]] ·
[[download-logic]]

**רכיבים:** [[cta-link]] · [[reveal]] · [[download-options]] · [[rtl-check-script]]

**החלטות:** [[d-001-icons-lucide-over-material-symbols]] ·
[[d-002-ploni-over-rubik-heebo]] · [[d-003-defer-sanity]] ·
[[d-004-ai-atmosphere-imagery]] · [[d-005-apk-interim-link]]

**מלכודות:** [[tailwind-v4-layering-trap]] · [[build-clobbers-dev-server]]

## מה לא חולץ, ולמה

- **פירוט מבנה התיקיות** — משכפל את מה שרואים בקוד. `code_refs` בכל דף עושה את
  אותה עבודה בלי להתיישן.
- **טבלת "איך מוסיפים דברים"** — הוראות תפעול, מקומן ב‑`CLAUDE.md` של השורש.
- **רשימת הנכסים** — משתנה כשהלקוח יספק נכסים סופיים; היא חיה ב‑`OPEN_ITEMS.md`.

## פערים שנפתחו

- אין דף לכל סקשן בעמוד הבית. נוצרו רק שלושת הרכיבים שיש בהם החלטה לא טריוויאלית.
  אם סקשן יהפוך למורכב — יקבל דף.
- שלושת מקורות האמת עצמם (הבריף, מסמך העיצוב, ה‑Design System) טרם נקלטו ישירות.
  ראו [[open-questions]].
