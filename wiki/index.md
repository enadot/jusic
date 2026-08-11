# Index — Wiki של jusic.co

הקטלוג של ה‑Wiki. **זו נקודת הכניסה לכל שאילתה** — קוראים את הקובץ הזה תחילה,
ואז פותחים רק את הדפים הרלוונטיים.

הכללים ב‑[CLAUDE.md](CLAUDE.md) · הכרונולוגיה ב‑[log.md](log.md)

---

## Concepts — מושגי ליבה

| דף | תקציר | סטטוס |
| --- | --- | --- |
| [[design-system]] | השפה הוויזואלית: העטיפות הן הצבע, אקצנט אחד, כהה בלבד | current |
| [[rtl-policy]] | עברית ו‑RTL כבסיס, ולמה זה נאכף בסקריפט ולא ב‑review | current |
| [[content-model]] | כל הטקסטים בקובץ אחד, וכללי מה מותר לומר | current |
| [[analytics-contract]] | `track(event, { placement })` — ולמה placement חובה | current |
| [[download-logic]] | מדגישים אפשרות אחת, לעולם לא מסתירים אחרת | current |
| [[accessibility]] | ת"י 5568 / WCAG 2.1 AA, ויחסי הניגודיות שנמדדו | current |
| [[performance-budget]] | 119 kB מתוך תקציב 150, ומה שומר על זה | current |

## Components — ישויות קוד

| דף | תקציר | סטטוס |
| --- | --- | --- |
| [[cta-link]] | CTA שנשאר קישור אמיתי ויורה אירוע מדידה | current |
| [[reveal]] | גילוי בגלילה ב‑CSS, שמשמש גם כטריגר `section_view` | current |
| [[download-options]] | ארבעת כרטיסי ההתקנה והכשל הבטוח של ה‑APK | current |
| [[rtl-check-script]] | שער האיכות שמכשיל את הבילד על כיווניות פיזית | current |

## Decisions — החלטות

| דף | תקציר | סטטוס |
| --- | --- | --- |
| [[d-001-icons-lucide-over-material-symbols]] | lucide במקום Material Symbols | current |
| [[d-002-ploni-over-rubik-heebo]] | Ploni כפונט המותג — רישיון טרם אומת | **open** |
| [[d-003-defer-sanity]] | בלי Sanity בשלב זה, במבנה שנשאר הפיך | current |
| [[d-004-ai-atmosphere-imagery]] | תמונות AI כסטייה מאושרת ומתוחמת | current |
| [[d-005-apk-interim-link]] | קישור Drive זמני, עם מנגנון הכיבוי מוכן | **open** |

## Topics — סינתזות ומלכודות

| דף | תקציר | סטטוס |
| --- | --- | --- |
| [[tailwind-v4-layering-trap]] | CSS לא‑מלוירת גוברת על utilities — שני באגים, סיבה אחת | current |
| [[build-clobbers-dev-server]] | `build` בזמן `dev` מתחזה לבאג בקוד | current |
| [[open-questions]] | כל מה שלא ידוע, לא נמדד או ממתין להחלטה | **open** |

## Sources — מקורות שנקלטו

| דף | סוג | נקלט |
| --- | --- | --- |
| [[architecture-doc]] | live · `docs/ARCHITECTURE.md` | 2026-08-11 |

---

## נקודות כניסה מומלצות

- **מצטרפים לפרויקט?** [[design-system]] → [[content-model]] → [[rtl-policy]]
- **נוגעים ב‑CSS?** [[tailwind-v4-layering-trap]] לפני הכול
- **נוגעים ב‑CTA או במדידה?** [[analytics-contract]] → [[cta-link]]
- **מה תקוע?** [[open-questions]]
