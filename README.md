# jusic.co

אתר המותג של **JUSIC** (ג׳וזיק) — פלטפורמת המוזיקה והתוכן היהודי מבית לומדעת.

האתר הוא אתר שיווק, אמון ורכישת משתמשים. הוא **אינו** נגן ואינו קטלוג — המוצר
עצמו חי ב‑[jusic.app](https://jusic.app) ובאפליקציות.

## הרצה מקומית

```bash
npm install
npm run dev
```

## סקריפטים

| פקודה | מה היא עושה |
| --- | --- |
| `npm run dev` | שרת פיתוח |
| `npm run build` | בילד לפרודקשן |
| `npm run lint` | בדיקת RTL + ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `node scripts/make-covers.mjs` | חיתוך מחדש של עטיפות המוקאפ מצילומי המסך |

## מבנה

- `src/content/site.ts` — **כל** הטקסטים באתר. אין טקסט מקודד ברכיבים.
- `src/components/sections/` — סקשן אחד לכל רכיב בעמוד הבית.
- `src/styles/globals.css` — טוקנים של מערכת העיצוב + בסיס.
- `src/lib/analytics.ts` — עטיפה אחת לכל האירועים, ללא תלות בספק.
- `scripts/check-rtl.mjs` — מכשיל את הבילד על שימוש בכיווניות פיזית.

## עמודים

| נתיב | תוכן |
| --- | --- |
| `/` | עמוד הבית (One Pager) |
| `/download` | עמוד הורדה מלא, כולל הוראות התקנת APK למכשירים כשרים |
| `/legal/accessibility` | הצהרת נגישות |
| `/legal/terms`, `/legal/privacy`, `/legal/copyright` | ממתינים לנוסח משפטי (`noindex`) |

## לפני עלייה לאוויר

ראו **[docs/OPEN_ITEMS.md](docs/OPEN_ITEMS.md)** — כתובת APK רשמית, עטיפות
מורשות, נוסח משפטי, ספק אנליטיקס ו‑DNS.

כללי העבודה על הפרויקט מרוכזים ב‑[CLAUDE.md](CLAUDE.md).
