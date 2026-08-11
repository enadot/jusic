# Log

יומן כרונולוגי append‑only. **לא משנים היסטוריה.**
פורמט קבוע: `## [YYYY-MM-DD] action | subject`

```bash
grep "^## \[" wiki/log.md | tail -5      # חמש הפעולות האחרונות
grep "^## \[" wiki/log.md | grep ingest  # כל הקליטות
```

---

## [2026-08-11] maintenance | הקמת ה‑Wiki

הוקמה השכבה השלישית: `CLAUDE.md` (סכימה), `index.md`, `log.md`,
`scripts/wiki-lint.mjs`, ומבנה `pages/{sources,concepts,components,decisions,topics}`.

**החלטות מבניות:** היקף = פרויקט jusic בלבד · מיקום = בתוך ריפו האתר תחת `wiki/`,
כך ש‑Claude Code קורא את הסכימה אוטומטית בלי להתנגש עם `CLAUDE.md` של השורש ·
שפה = תוכן בעברית, שמות קבצים באנגלית.

**התאמה לסכימה הגנרית:** נוסף מושג `kind: live | snapshot` למקורות, כי בפרויקט
קוד חלק מהמקורות ממשיכים להשתנות. בנוסף, כל דף שמתאר קוד נושא `code_refs`,
וה‑lint מכשיל כשנתיב שכזה נעלם — זהו סימן ההתיישנות המרכזי ב‑Wiki על קוד חי.

---

## [2026-08-11] ingest | architecture-doc

**מקור:** `docs/ARCHITECTURE.md` (kind: `live`, commit `16ff258`).
נבחר כמקור ראשון כי הוא כבר מסנתז את שלושת מקורות האמת של הפרויקט — הבריף,
מסמך העיצוב ומערכת העיצוב — ואת ההכרעות בין הסתירות שלהם.

**נוצרו 20 דפים:**

- sources (1): [[architecture-doc]]
- concepts (7): [[design-system]] · [[rtl-policy]] · [[content-model]] ·
  [[analytics-contract]] · [[download-logic]] · [[accessibility]] ·
  [[performance-budget]]
- components (4): [[cta-link]] · [[reveal]] · [[download-options]] ·
  [[rtl-check-script]]
- decisions (5): [[d-001-icons-lucide-over-material-symbols]] ·
  [[d-002-ploni-over-rubik-heebo]] · [[d-003-defer-sanity]] ·
  [[d-004-ai-atmosphere-imagery]] · [[d-005-apk-interim-link]]
- topics (3): [[tailwind-v4-layering-trap]] · [[build-clobbers-dev-server]] ·
  [[open-questions]]

**סתירות שתועדו:** חמש ההחלטות כולן נוצרו מסתירות בין הבריף למערכת העיצוב או
בין הבריף לבחירת הלקוח. אף אחת מהן לא נמחקה — כל אחת מתעדת את שני הצדדים ואת
הנימוק להכרעה. שתיים נשארו `open` כי הן תלויות בקלט מהלקוח.

**חריגה מהסכימה:** צעד 3 (עצירה לאישור לפני כתיבה) לא בוצע, כי ה‑ingest הזה היה
הדגמת התהליך עצמו. מה‑ingest הבא — עוצרים.

**פערים שנפתחו:** ראו [[open-questions]].
