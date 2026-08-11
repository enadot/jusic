# פרומפט ל-Claude Code — בניית JUSIC.co מחדש

> קובץ זה נועד להדבקה כהודעה ראשונה ב-Claude Code בתיקיית פרויקט ריקה.
> מומלץ לשמור אותו בהמשך בתוך הריפו כ-`docs/PROJECT_BRIEF.md` ולייצר ממנו `CLAUDE.md`.

---

## 0. הוראת פתיחה ל-Claude Code

אתה בונה מאפס את אתר המותג של **JUSIC** (ג׳וזיק) בכתובת `jusic.co`.

לפני שאתה כותב שורת קוד ראשונה:

1. קרא את כל המסמך הזה.
2. הצג לי **תוכנית עבודה בשלבים** (Milestones) לאישור.
3. צור `CLAUDE.md` בשורש הפרויקט שמסכם: stack, קונבנציות, מבנה תיקיות, כללי RTL, כללי תוכן, כללי אנליטיקס.
4. רק אחרי אישור שלי — התחל Milestone 1.

אל תתחיל להתקין חבילות לפני שהצגת את התוכנית.

**כלל ברזל לאורך כל הפרויקט:** אין להמציא נתונים, מספרים, פיצ׳רים, מחירים או הבטחות שיווקיות. כל טקסט באתר מגיע ממסמך התוכן או מ-Sanity. אם חסר תוכן — השתמש ב-placeholder מסומן ורשום אותו ב-`docs/OPEN_ITEMS.md`.

---

## 1. מה זה JUSIC

JUSIC היא פלטפורמת מוזיקה ותוכן יהודי מבית **לומדעת**, המיועדת בעיקר לקהל הדתי והחרדי.

המוצר כולל: מוזיקה יהודית מקורית (חדשה ונוסטלגית), אמנים, אלבומים, פלייליסטים אישיים, המלצות חכמות, סטוריז של אמנים, משחקי טריוויה מוזיקליים, שיעורי תורה, רדיו ופודקאסטים.

זמינות: Web App, Android (Google Play), iOS (App Store), ו-APK להתקנה במכשירים כשרים ללא Google Play.

### מיצוב
**הבית הדיגיטלי של המוזיקה והתוכן היהודי.**

### הבטחת מותג
**כל המוזיקה והתוכן היהודי שאתם אוהבים — בחוויה חכמה, נקייה ואישית.**

### מה האתר הזה **אינו**
`jusic.co` הוא אתר מותג, שיווק, אמון ורכישת משתמשים.
הוא **אינו** נגן, אינו קטלוג מוזיקה ואינו משכפל את פונקציונליות האפליקציה.
המוצר עצמו חי ב-`jusic.app` ובאפליקציות.

לכל רכיב שאתה בונה — שאל את עצמך: *האם זה שיווק/מידע, או שזה שייך למוצר עצמו?* אם זה שייך למוצר — אל תבנה אותו כאן.

---

## 2. מטרות האתר (לפי סדר עדיפות)

1. להסביר מהי JUSIC תוך 5 שניות.
2. להוביל להתקנה / האזנה — Web, Google Play, App Store, APK.
3. לבנות אמון (תוכן נקי, כבוד ליוצרים, חברה מזוהה).
4. לשרת אמנים, מפיקים ובעלי זכויות כערוץ פנייה.
5. להיות המקור הסמכותי על JUSIC עבור מנועי חיפוש ומערכות AI.
6. לאפשר לצוות השיווק להקים עמודי נחיתה לקמפיינים בלי מפתח.

**KPI ראשי:** שיעור המרה מביקור ← לחיצת התקנה/האזנה, בפילוח לפי פלטפורמה.

---

## 3. Stack טכנולוגי

חובה:

| שכבה | טכנולוגיה |
|---|---|
| Framework | **Next.js 15+**, App Router, TypeScript strict, RSC by default |
| Styling | **Tailwind CSS v4** (CSS-first config, `@theme`) |
| רכיבי UI | **shadcn/ui** (CLI, רכיבים בתוך הריפו, לא dependency) |
| רכיבי אפקט | **Magic UI** — בשימוש מדוד בלבד (ראה §7) |
| אנימציה | **Framer Motion / `motion`** |
| CMS | **Sanity v3** — Embedded Studio ב-`/studio`, `next-sanity`, GROQ, Live Content API |
| אייקונים | `lucide-react` |
| טפסים | `react-hook-form` + `zod` (אם ייבנה טופס; ראה §11) |
| Deploy | **Vercel** |
| Package manager | `pnpm` |

אסור: WordPress, jQuery, CSS-in-JS runtime libraries, UI kits נוספים, ספריות אנימציה נוספות.

---

## 4. עברית ו-RTL — דרישת ליבה

זה לא "תוספת", זה בסיס הפרויקט.

- `<html lang="he" dir="rtl">`
- להשתמש **אך ורק** ב-logical properties של Tailwind: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`, `border-s`, `border-e`.
  **אסור** `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`.
- לוודא שכל רכיב shadcn/ui שנוסף עובר תיקון RTL (Sheet, Dropdown, Accordion chevrons, Carousel direction).
- אייקוני כיווניות (חצים) חייבים להתהפך ב-RTL.
- מספרים, מחירים, שמות מותג לועזיים ו-URLs: לעטוף ב-`<bdi>` או `dir="ltr"` כדי למנוע שיבושי bidi. במיוחד: `19.90 ₪`, `Jusic`, `Google Play`, `App Store`, `APK`.
- טיפוגרפיה: פונט עברי מודרני עם משקלים מלאים — **Rubik** או **Heebo** (`next/font/google`), `display: swap`, subset `hebrew` + `latin`.
- להוסיף ESLint rule / בדיקת CI שמכשילה build אם נמצא `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-` בקוד.

---

## 5. שפה עיצובית

המוצר צריך להיראות כמו אפליקציית מוזיקה בינלאומית — **לא** כמו אתר תוכן חרדי ישן ולא כמו תבנית SaaS גנרית.

### צבעים
חלץ את הצבעים המדויקים מקובצי הלוגו שאספק (`logo.png`, `logowhite.png`, `logoblack.png`, `logo_icon_only_notext.png`).
נקודת מוצא (יש לאמת מול הקבצים):

```
--brand-cyan:  #29B8DC   /* צבע ראשי — אקצנט, CTA, פלייר */
--brand-slate: #6E8583   /* משני — אפור-ירקרק מהמשולש */
--bg-base:     #0E1113   /* רקע כהה עמוק (תואם לאפליקציה) */
--bg-elev:     #16191C
```

- **Dark-first.** האפליקציה כהה — האתר צריך להרגיש כמו המשך שלה.
- מותר Light mode, אבל Dark הוא ברירת המחדל ולא להיפך.
- הציאן הוא **אקצנט**, לא רקע. אל תמלא מסכים בציאן.
- אין קלישאות ויזואליות דתיות (מגן דוד דקורטיבי, כותל, נרות, גווילים). הזהות היהודית מגיעה מהתוכן והאמנים, לא מסמלים.

### שפת צורה
- פינות מעוגלות רכות (`rounded-2xl` / `rounded-3xl`).
- מסכי מוצר אמיתיים (הצילומים שאספק) כגיבור הוויזואלי — לא איורים גנריים ולא mockups מומצאים של מסכים שלא קיימים.
- מרווחים נדיבים, היררכיה טיפוגרפית ברורה, כותרות גדולות.
- Grain / gradient mesh עדין מותר. Glassmorphism כבד — לא.

### נגישות
תקן ישראלי **ת"י 5568** ברמת **WCAG 2.1 AA**:
- ניגודיות ≥ 4.5:1 לטקסט רגיל, ≥ 3:1 לטקסט גדול ולרכיבי UI.
- `:focus-visible` נראה בבירור בכל אלמנט אינטראקטיבי.
- ניווט מקלדת מלא, כולל האקורדיון והתפריט הנייד.
- `prefers-reduced-motion` — מבטל את כל האנימציות הלא-חיוניות.
- Skip to content link.
- `aria-label` בעברית לכל כפתור אייקון.
- עמוד **הצהרת נגישות** ייעודי.

---

## 6. תוכן ותרגום לקוד

אספק לך שני מסמכי מקור:
- `Jusic_co-content-brief-he.md` — טקסטים מאושרים לאתר.
- `JUSIC_Brief_2026.md` — בריף מותג, מוצר ומיצוב.

**כללים:**
1. הטקסטים במסמך התוכן הם המקור. אל תשכתב אותם ביוזמתך.
2. אם ניסוח נראה בעייתי — אל תשנה בשקט. רשום הצעה ב-`docs/COPY_SUGGESTIONS.md`.
3. **טענות רגישות** שדורשות אישור ואסור להרחיב מעבר לניסוח הקיים:
   - "נקייה ב-100%"
   - "פלטפורמת התוכן היהודית המובילה"
   - "מודל התגמול דואג ליוצרים מהשקל הראשון"
   - מחיר פרימיום 19.90 ₪
   - הורדה אופליין ובקרת הורים — **פיצ׳רים עתידיים בלבד**. אסור להציג כזמינים.
4. **אסור** להוסיף: מספר משתמשים, מספר שירים, מספר אמנים, דירוגים, לוגואים של שותפים, המלצות משתמשים — אלא אם סופקו לך במפורש.
5. אסור להציג יכולות AI כפיצ׳ר מוצר.

---

## 7. אנימציה — כללי ריסון

Framer Motion ו-Magic UI קיימים כדי לתת תחושת מוצר פרימיום, לא כדי להרשים.

**מותר:**
- Fade + slide-up עדין ב-scroll reveal (`whileInView`, `once: true`, offset ~24px, duration 0.4–0.6s, easing מותאם).
- Stagger קל בין כרטיסים (0.06–0.08s).
- Micro-interactions בכפתורים ובכרטיסים (scale ≤ 1.02).
- Magic UI: לכל היותר **2–3** אפקטים בכל האתר. מומלצים: `AnimatedGradientText` / `BorderBeam` בכרטיס אחד / `Marquee` עדין ללוגואים או לתגיות אמון.

**אסור:**
- Parallax כבד, טקסט שמתגלגל אות-אות בכל כותרת, Confetti, Beams, Meteors, Particles, אלמנטים שרודפים אחרי העכבר.
- אנימציה שמעכבת LCP או גורמת ל-CLS.
- אנימציה כלשהי כאשר `prefers-reduced-motion: reduce`.

---

## 8. ארכיטקטורת מידע

שלב 1 — **One Pager** (לפי הבריף הקיים), אבל בנוי מודולרית כך שכל סקשן הוא רכיב עצמאי שניתן לשלוף לעמוד נפרד ללא refactor.

```
/                       עמוד הבית (One Pager)
  #why                  למה JUSIC
  #features             מה מחכה לכם
  #artists              לאמנים וליוצרים
  #faq                  שאלות נפוצות
  #contact              יצירת קשר
/download               עמוד הורדה מלא + הוראות APK למכשירים כשרים
/artists                עמוד אמנים ובעלי זכויות
/legal/terms            תקנון ותנאי שימוש
/legal/privacy          מדיניות פרטיות
/legal/accessibility    הצהרת נגישות
/legal/copyright        זכויות יוצרים
/l/[slug]               עמודי נחיתה לקמפיינים (מנוהלים ב-Sanity)
/studio                 Sanity Studio
```

עמודי `/download` ו-`/legal/*` נבנים כבר בשלב 1 (הכרחיים ל-SEO, לאמון ולמכשירים כשרים).
עמודים כמו `/artists/[slug]` או `/songs/[slug]` — **לא בשלב הזה**. רק אם יוגדר ערך מוצרי/SEO אמיתי.

### סקשנים בעמוד הבית
1. Hero — כותרת, כותרת משנה, תגיות אמון, כפתורי CTA, ויזואל מסכי אפליקציה.
2. למה JUSIC — חוויה נקייה לכל המשפחה.
3. מה מחכה לכם — 5 כרטיסים + 6 תגיות קצרות.
4. פלטפורמות והורדה — Web / Google Play / App Store / APK.
5. לאמנים וליוצרים.
6. FAQ — אקורדיון נגיש.
7. CTA סופי.
8. פוטר — יצירת קשר לפי נושא, קישורים, קישורים משפטיים, שורת זכויות.

---

## 9. Sanity — מודל תוכן

Embedded Studio ב-`/studio`. ממשק ה-Studio בעברית עד כמה שניתן, כל שמות השדות ותיאוריהם בעברית.

### Singletons
```
siteSettings
  ├── siteName, tagline
  ├── logo (light / dark / icon)
  ├── defaultSeo { title, description, ogImage }
  ├── contactEmail
  ├── legalCompanyName            // לומדעת טכנולוגיות מסחר ויזמות בע״מ
  └── copyrightYear

downloadLinks                     // מקור אמת יחיד לכל קישורי ההורדה
  ├── webAppUrl
  ├── googlePlayUrl
  ├── appStoreUrl
  └── apk { url, version, releaseDate, fileSize, sha256, isPublished }

homePage
  └── sections[]                  // Portable / array of section objects
```

### Section types (ניתנים לסידור מחדש ולכיבוי)
`heroSection`, `valueSection`, `featureGridSection`, `platformsSection`, `artistsSection`, `faqSection`, `ctaSection`

לכל section: `_key`, `isVisible`, `anchorId`, `eyebrow`, `heading`, `body`, `ctas[]`.

### Documents
```
faqItem       { question, answer (Portable Text), order, category }
legalPage     { title, slug, body (Portable Text), lastUpdated, effectiveDate }
landingPage   { title, slug, sections[], seo, campaignId, isActive }
contactTopic  { label, emoji, subjectLine, order }   // כפתורי mailto בפוטר
```

### דרישות מימוש Sanity
- טיפוסים אוטומטיים: `sanity typegen` → `sanity.types.ts`, ובדיקה ב-CI.
- שאילתות GROQ מרוכזות ב-`src/sanity/queries/` — לא inline ברכיבים.
- **Live Content API** + `revalidateTag` / webhook לעדכון מיידי.
- Draft Mode + Presentation tool עם Visual Editing ל-preview לפני פרסום.
- כל שדה טקסט עם `validation` ואורך מומלץ, וכל תמונה עם `alt` **חובה**.
- `apk.isPublished` — כשהוא `false`, כפתור ה-APK מוחלף באוטומט בהודעה "בקרוב" ולא מקשר לשום מקום.

---

## 10. לוגיקת הורדה חכמה

רכיב `<SmartDownloadButton />`:

1. זיהוי פלטפורמה client-side (User-Agent Client Hints, עם fallback ל-UA).
2. iOS → App Store. Android עם Google Play → Google Play. Desktop → Web App. Android ללא Play Services / מכשיר כשר → APK.
3. **תמיד** להציג את כל האפשרויות כרשימה משנית. אין להסתיר אפשרות.
4. APK מוצג כאפשרות נפרדת, מוסברת ומכובדת — לא כ"פתרון עוקף". להציג גרסה, תאריך ומשקל קובץ.
5. במובייל: Sticky CTA bar תחתון שמופיע אחרי גלילת ה-Hero. חייב לכבד safe-area insets ולא להסתיר תוכן.
6. אין להשתמש בכתובת APK זמנית או לא רשמית. אם `apkUrl` ריק — הכפתור מושבת.

---

## 11. יצירת קשר

שלב 1: כפתורי `mailto:` לפי נושא (לפי מסמך התוכן) אל `editor@jusic.co` עם `subject` מוגדר מראש.
הנושאים מנוהלים ב-Sanity (`contactTopic`).

אל תבנה טופס עם backend בשלב הזה. אם תזהה צורך — הצע אותו ב-`docs/OPEN_ITEMS.md` יחד עם השלכות פרטיות ו-spam.

---

## 12. אנליטיקס

Wrapper אחד: `src/lib/analytics.ts` עם `track(event, params)`, agnostic לספק (GA4 / Vercel Analytics / GTM לפי מה שיוחלט).

אירועים חובה:
```
listen_web_click
google_play_click
app_store_click
apk_download_click
premium_click
artist_contact_click
copyright_contact_click
bug_report_click
idea_contact_click
faq_open            { question_id }
section_view        { section_id }
sticky_cta_click    { platform }
```

- כל אירוע עם `placement` (hero / platforms / cta / footer / sticky) כדי לדעת מה עובד.
- תמיכה ב-UTM: לשמור ב-`sessionStorage` ולצרף לאירועים.
- לא לטעון סקריפטים של צד שלישי לפני אינטראקציה או לפני LCP.
- אין Cookies לא-חיוניים ללא הסכמה. אם נדרש Consent — לממש כראוי, לא כבאנר דקורטיבי.

---

## 13. SEO ו-AI Discoverability

- Metadata API של Next.js לכל route, כולל `openGraph`, `twitter`, `alternates.canonical`.
- OG Image דינמי (`next/og`) בעברית, עם הלוגו.
- Structured Data (JSON-LD): `Organization`, `WebSite`, `SoftwareApplication` (Android + iOS), `FAQPage` (**רק** אם השאלות מוצגות בפועל בעמוד), `BreadcrumbList` בעמודים פנימיים.
- `sitemap.ts` + `robots.ts` דינמיים מ-Sanity.
- כתיבה עובדתית וברורה: מה זה JUSIC, למי, איפה זמין, חינם מול פרימיום, איזה מכשירים, איך אמנים מצטרפים. זה מה שמערכות AI מצטטות.
- `llms.txt` בשורש עם סיכום עובדתי תמציתי של המותג והמוצר.

---

## 14. ביצועים

יעדים ב-Mobile Lighthouse / CrUX:
- LCP < 2.0s
- INP < 200ms
- CLS < 0.05
- JS ראשוני < 150KB gzipped

כללים:
- RSC כברירת מחדל. `"use client"` רק ברכיבים אינטראקטיביים ובעלים של העץ.
- `next/image` לכל תמונה, כולל תמונות Sanity עם `@sanity/image-url` ו-`sizes` נכון.
- צילומי המסך של האפליקציה — `priority` ל-Hero בלבד.
- Framer Motion ב-dynamic import כשאפשר.
- אין Web Fonts מיותרים. משקל אחד או שניים לכל היותר.

---

## 15. איכות קוד

```
src/
├── app/
│   ├── (site)/          # עמודי אתר עם layout משותף
│   ├── studio/
│   ├── api/
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/              # shadcn/ui
│   ├── magic/           # Magic UI (מוגבל)
│   ├── sections/        # סקשנים של האתר
│   └── shared/
├── sanity/
│   ├── schemas/
│   ├── queries/
│   ├── lib/
│   └── structure.ts
├── lib/
│   ├── analytics.ts
│   ├── platform.ts
│   └── utils.ts
└── styles/
```

- TypeScript `strict`, אין `any`.
- ESLint + Prettier + `prettier-plugin-tailwindcss`.
- Husky + lint-staged.
- Conventional Commits.
- כל env var מתועד ב-`.env.example`. אין secrets בריפו.
- `SANITY_API_READ_TOKEN` — server-side בלבד.

---

## 16. Milestones

**M1 — תשתית**
Next.js + TS + Tailwind v4 + shadcn/ui + RTL + פונטים + design tokens מהלוגו + layout + ESLint/CI. Deploy ראשוני ל-Vercel.

**M2 — Sanity**
Schemas, Embedded Studio, typegen, GROQ, Live Content, Draft Mode, seed של כל התוכן הקיים מהבריף.

**M3 — עמוד הבית**
כל הסקשנים מונעי-Sanity, מלאי תוכן אמיתי, רספונסיביים, RTL תקין.

**M4 — הורדה ומשפטי**
`/download`, `SmartDownloadButton`, Sticky CTA, `/legal/*`.

**M5 — אנימציה וליטוש**
Framer Motion + Magic UI במידה, `prefers-reduced-motion`, מיקרו-אינטראקציות.

**M6 — SEO, אנליטיקס, נגישות**
Metadata, JSON-LD, OG דינמי, sitemap, `llms.txt`, אירועי אנליטיקס, ביקורת WCAG 2.1 AA.

**M7 — עמודי נחיתה**
`/l/[slug]` מ-Sanity.

**M8 — מסירה**
`README.md`, `CLAUDE.md`, `docs/CONTENT_EDITING.md` (מדריך למשתמש לא-טכני), `docs/OPEN_ITEMS.md`, Lighthouse report, בדיקת קישורים בפרודקשן.

בסוף כל Milestone: עצור, הצג סיכום קצר של מה נבנה ומה נשאר פתוח, וקבל אישור לפני המשך.

---

## 17. Definition of Done

- [ ] כל הטקסטים מגיעים מ-Sanity, לא hardcoded.
- [ ] RTL תקין ב-320px, 768px, 1440px, 1920px.
- [ ] אפס שימוש ב-`ml-/mr-/pl-/pr-/left-/right-`.
- [ ] Lighthouse Mobile: Performance ≥ 90, Accessibility 100, SEO 100.
- [ ] ניווט מקלדת מלא + Focus visible בכל מקום.
- [ ] `prefers-reduced-motion` מכובד.
- [ ] כל CTA יורה אירוע אנליטיקס עם `placement`.
- [ ] אין קישור שבור, אין `#` ריק, אין placeholder בפרודקשן.
- [ ] אין טענה שיווקית שאינה במסמך התוכן.
- [ ] כפתור APK מושבת אוטומטית כשאין URL מאושר.
- [ ] `docs/OPEN_ITEMS.md` מעודכן.

---

## 18. פריטים פתוחים לאיסוף ממני

רשום ב-`docs/OPEN_ITEMS.md` ובקש ממני:

1. כתובת רשמית לקובץ APK + גרסה + תאריך + משקל.
2. כתובות סופיות: תקנון, מדיניות פרטיות, הצהרת נגישות, זכויות יוצרים.
3. אישור סופי למחיר פרימיום (19.90 ₪) ולניסוח מסלול חינם.
4. אישור לניסוח "נקייה ב-100%" ו"הפלטפורמה המובילה".
5. Sanity `projectId` + `dataset`.
6. ספק אנליטיקס ומזהה מדידה.
7. קובצי לוגו וקטוריים (SVG) אם קיימים.
8. צילומי מסך נוספים ובאיכות גבוהה מהאפליקציה.
9. גישה לדומיין ל-DNS.
10. האם נדרשת גרסה אנגלית בעתיד (משפיע על ארכיטקטורת i18n כבר עכשיו).

---

## 19. נכסים שאספק

```
/assets
  logo.png                       לוגו מלא צבעוני
  logowhite.png                  לוגו לבן
  logoblack.png                  לוגו שחור
  logo_icon_only_notext.png      אייקון בלבד
  inapp_screenshot_home_screen_.jpg
  inapp_screenshot_playlist_.jpg
/docs
  Jusic_co-content-brief-he.md
  JUSIC_Brief_2026.md
```

חלץ את פלטת הצבעים מקובצי הלוגו והצג לי אותה לאישור לפני שאתה קובע את ה-design tokens.

---

**התחל עכשיו: קרא את המסמך, ואז הצג לי את תוכנית העבודה ואת טיוטת `CLAUDE.md` לאישור.**
