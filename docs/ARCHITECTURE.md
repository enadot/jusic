# ארכיטקטורה — jusic.co

תיעוד טכני של אתר המותג. המסמך מתאר **מה קיים ולמה**, לא מה מתוכנן.
כללי העבודה השוטפים נמצאים ב‑[CLAUDE.md](../CLAUDE.md); פריטים פתוחים
ב‑[OPEN_ITEMS.md](OPEN_ITEMS.md).

---

## 1. גבולות המערכת

`jusic.co` הוא אתר **שיווק, אמון ורכישת משתמשים**. הוא אינו נגן, אינו קטלוג
ואינו משכפל פונקציונליות של המוצר. המוצר עצמו חי ב‑`jusic.app` ובאפליקציות
המובייל.

הכלל המנחה לכל רכיב: *האם זה שיווק/מידע, או שזה שייך למוצר?* אם זה שייך למוצר —
הוא לא נבנה כאן.

**KPI ראשי:** שיעור המרה מביקור ← לחיצת התקנה/האזנה, בפילוח לפי פלטפורמה. כל
המבנה הטכני משרת את המדידה הזו (ראו §6).

---

## 2. מקורות האמת

לאתר יש שלושה מקורות אמת חיצוניים שאין לסתור:

| מקור | מה הוא קובע |
| --- | --- |
| `docs/PROJECT_BRIEF.md` | Stack, כללי RTL, כללי תוכן, אנליטיקס, נגישות, Definition of Done |
| Claude Design project `750b974f`, variant **`Jusic Home F - Kinetic Type`** | הפריסה, הטיפוגרפיה והטקסטים של עמוד הבית |
| `jusic-design-system-bd48b83e` (`readme.md` + `tokens/`) | חוקי השפה הוויזואלית — צבע, צורה, תנועה, טיפוגרפיה |

מסמך העיצוב וה‑Design System גוברים בשאלות ויזואליות; הבריף גובר בשאלות של
Stack, תוכן, נגישות ומדידה. שתי סתירות שהתגלו בין השניים תועדו והוכרעו במפורש
ב‑`OPEN_ITEMS.md` (אייקונים, פונט).

---

## 3. Stack ומבנה

Next.js 15 App Router · TypeScript strict · Tailwind CSS v4 (CSS‑first) ·
`lucide-react` · npm · Vercel.

**אין**: Sanity (בשלב זה), shadcn/ui, Magic UI, ספריות אנימציה, CSS‑in‑JS.

```
src/
├── app/                    routes בלבד — כל route רזה ומרכיב סקשנים
│   ├── page.tsx            עמוד הבית
│   ├── download/           עמוד ההורדה
│   ├── legal/{4}/          עמודים משפטיים
│   ├── layout.tsx          html/dir/lang, פונט, skip link, metadata גלובלי
│   ├── opengraph-image.tsx OG דינמי (next/og, Node runtime)
│   ├── sitemap.ts robots.ts
├── components/
│   ├── ui/                 Button, CtaLink, Icon, Reveal
│   ├── sections/           סקשן אחד לכל חלק בעמוד הבית
│   ├── download/           DownloadOptions
│   └── shared/             Container, StickyCta, JsonLd, LegalLayout, UtmCapture
├── content/site.ts         כל הטקסטים
├── lib/                    analytics, platform, schema, cn
└── styles/globals.css      טוקנים + base
```

**עיקרון מנחה:** כל סקשן בעמוד הבית הוא רכיב עצמאי שאינו יודע דבר על שכניו.
ניתן לשלוף כל אחד מהם לעמוד נפרד בלי refactor — זו הדרישה שמאפשרת מעבר עתידי
מ‑One Pager למבנה רב‑עמודי.

---

## 4. שכבת התוכן

`src/content/site.ts` הוא **מקור האמת היחיד לכל מחרוזת** באתר. אין טקסט מקודד
בתוך רכיב.

המבנה נבחר כך שהחלפה ל‑Sanity תהיה החלפת **מקור נתונים** ולא refactor: כל
export הוא אובייקט שטוח יחסית שמתאים אחד‑לאחד למסמך או ל‑section object
עתידי (`hero`, `why`, `features.items`, `faq.items`, `contact.topics`,
`download`). הרכיבים צורכים props/ערכים, לא קבצים.

שני עזרים חיים באותו קובץ כי הם חלק מהחוזה של התוכן:
`mailto(subject)` ו‑`cover(n)`.

### כללי תוכן אכיפים

- אין להמציא מספרים, דירוגים, המלצות או לוגואים של שותפים.
- טענות מאושרות‑כלשונן שאין להרחיב: `נקייה ב־100%`, `פלטפורמת התוכן היהודית
  המובילה`, `מודל התגמול דואג ליוצרים מהשקל הראשון`, `19.90 ₪`.
- הורדה אופליין ובקרת הורים — **עתידיות בלבד**, ומופיעות רק בתשובת FAQ.
- שינוי ניסוח לא נעשה בשקט; הצעות נרשמות ב‑`COPY_SUGGESTIONS.md`.

### נתונים שעלולים להיעדר

`apkRelease` (version / releaseDate / fileSize) הוא `null` עד שהלקוח יספק ערכים,
והרכיב פשוט לא מרנדר אותם. `links.apk` ריק ⇒ כפתור ה‑APK הופך אוטומטית למצב
״בקרוב״ מושבת ואינו מקשר לשום מקום. זו התנהגות מכוונת: **אין URL לא רשמי**.

---

## 5. שכבת העיצוב

### מודל הטוקנים

`globals.css` בנוי משלוש שכבות, ובכוונה:

1. **`@theme`** — טוקנים גולמיים שמייצרים utilities של Tailwind
   (`--color-cyan-500` ⇒ `bg-cyan-500`, `text-cyan-500`…).
2. **`:root`** — שמות המשתנים של ה‑Design System (`--bg`, `--text-secondary`,
   `--gradient-brand`, `--dur-base`…), ממופים אל טוקני `@theme`. הם קיימים כדי
   שהמרקאפ המיובא מהעיצוב יקרא 1:1 מול המקור.
3. **`@layer base`** — reset, אלמנטים, ומחלקות התצוגה המשותפות
   (`.mega`, `.outline-word`, `.inlineart`, `.rv`, `.skip-link`).

> **מלכודת שנפלנו בה, ותועדה בקוד:** ב‑Tailwind v4 ה‑utilities יושבים
> ב‑`@layer utilities`, ו‑CSS **לא‑מלוירת גוברת על כל CSS מלוירת** ללא קשר
> לספציפיות. `a { color: … }` לא‑מלוירת ניצחה את `text-text-on-cyan` וגרמה
> לכפתור ה‑CTA הראשי להיות ציאן‑על‑ציאן ביחס 1.17:1. לכן **כל** ה‑base יושב
> ב‑`@layer base`. חריג יחיד: override של טוקן ב‑media query נשאר מחוץ ללייר,
> לצד ה‑`:root` שאותו הוא דורס.

### חוקים ויזואליים שאסור להפר

- כהה בלבד. אין light mode.
- **העטיפות הן הצבע.** המסגרת נשארת כמעט‑שחורה ונטולת רוויה כדי שהעטיפות ירעשו.
- אקצנט אחד: ציאן `#1EB0D5` = פעולה; Sage `#778A84` = מבנה. אין צבע מותג שלישי.
- **לבן על ציאן = 2.6:1 ונכשל.** מילוי ציאן נושא תמיד `#0F1417`.
- ציאן מעל ~15% מהמסך רועש מדי.
- Pills בלבד. אין כפתורים מרובעים.
- Glass רק היכן שתוכן באמת נע מתחת (header, sticky bar).
- אלמנט אחד לכל היותר עם ה‑gradient המותגי בכל עמוד.
- אין סמליות יהודית דקורטיבית. הזהות מגיעה מהתוכן.

### טיפוגרפיה

**Ploni** (Fontef), self‑hosted דרך `next/font/local`, ארבעה משקלים אמיתיים
(300/400/700/800) כדי ששום משקל לא ייווצר סינתטית. `display: swap`.

### תמונות אווירה — סטייה מכוונת

ה‑Design System אוסר רקעים פוטוגרפיים וסגנון איור. הלקוח ביקש במפורש תמונות
אווירה, ולכן `public/atmos/*` הן חריגה מאושרת ומתוחמת:

- מופשטות בלבד — שדות כהים ואור ציאן. ללא אנשים, פנים, סמלים, טקסט או עטיפות
  מזויפות.
- תמיד מתחת ל‑scrim, בשקיפות 14–20%, כך שיחסי הניגודיות של הטקסט לא נפגעים.
- תמיד `alt=""` — הן דקורטיביות.
- WebP, 10–44KB כל אחת. רק תמונת ה‑Hero היא `priority`.

---

## 6. אנליטיקס

`src/lib/analytics.ts` הוא **הממשק היחיד**. אף רכיב לא קורא ל‑GA4/GTM ישירות.

```
track(event, { placement, ...params })
```

- `AnalyticsEvent` — union סגור של האירועים מהבריף §12. הוספת אירוע היא שינוי
  טיפוס, כך שאי אפשר לירות אירוע שלא הוגדר.
- `placement` — **חובה** בכל אירוע:
  `hero | platforms | cta | footer | sticky | header | download | faq`.
  בלעדיו אי אפשר לדעת איזה מיקום ממיר, וזה בדיוק ה‑KPI.
- UTM נקלטים פעם אחת לסשן (`UtmCapture` → `sessionStorage`) ומצורפים אוטומטית
  לכל אירוע.
- `dispatch()` בוחר ספק בזמן ריצה: `dataLayer` → `gtag` → בפיתוח, `console.info`.
  **לא נטען שום סקריפט צד‑שלישי.** חיבור ספק = שינוי בפונקציה אחת.

`CtaLink` הוא הרכיב שמחבר בין השניים: הוא נשאר `<a>` אמיתי (כולל לחיצה אמצעית
ופתיחה בטאב חדש) ויורה את האירוע ב‑`onClick` בלי לחסום ניווט.

---

## 7. RTL

`<html lang="he" dir="rtl">`. **Logical properties בלבד.**

`scripts/check-rtl.mjs` רץ כחלק מ‑`npm run lint` ומכשיל את הבילד על כל שימוש
ב‑`ml-/mr-/pl-/pr-/left-/right-/text-left/text-right/border-l/border-r/rounded-tl…`
ועל מקבילותיהן ב‑CSS. הבדיקה מתאימה **טוקנים שלמים** כדי למנוע false positives.
פתח מילוט יחיד: הערת `rtl-allow` בסוף השורה — ודורשת נימוק.

הרציונל: `ml-4` נראה תקין ב‑review ומתהפך בשקט בעברית. זו מחלקת באגים שבן אדם
מפספס וסקריפט לא.

מספרים, שמות מותג לועזיים ו‑URLs נעטפים ב‑`<bdi>` או `dir="ltr"`.

---

## 8. נגישות

תקן ת"י 5568 ברמת WCAG 2.1 AA.

- Skip link כאלמנט הראשון ב‑`<body>`.
- `:focus-visible` = טבעת `#5FCEE5` בעובי 2px ב‑offset 2px — **טבעת, לא שינוי
  מילוי**, בכל אלמנט אינטראקטיבי.
- ה‑FAQ בנוי על `<details>/<summary>` נייטיביים: מקלדת ו‑semantics בחינם.
- כל כפתור אייקון נושא `aria-label` בעברית; אין אף פקד ללא שם נגיש.
- `prefers-reduced-motion: reduce` מבטל את ה‑reveals לחלוטין ומאפס כל
  transition/animation.
- `<noscript>` מכריח `.rv { opacity: 1 }` — התוכן לעולם לא תלוי ב‑JS כדי
  להיראות.

יחסי ניגודיות שנמדדו בפועל בדפדפן: CTA ראשי 7.26:1 · טקסט משני 9.97:1 ·
שורת זכויות 6.26:1 · קישורי ניווט 9.97:1.

---

## 9. ביצועים

| יעד | מצב |
| --- | --- |
| Initial JS | **119 kB** (תקציב 150 kB) |
| RSC by default | `"use client"` רק ב‑5 עלים: `SiteHeader`, `Faq`, `Reveal`, `CtaLink`, `StickyCta`, `DownloadOptions`, `UtmCapture` |
| תמונות | `next/image` בכל מקום, AVIF/WebP, `priority` ל‑Hero בלבד |
| אנימציה | CSS + `IntersectionObserver`. **אין ספריית אנימציה** — `Reveal` רק מוסיף class |
| פונטים | משפחה אחת, self‑hosted, `swap` |

`Reveal` משמש גם כטריגר ל‑`section_view`, כדי לא להריץ observer שני על אותם
אלמנטים.

---

## 10. עמודים

| נתיב | מה יש בו | הערות |
| --- | --- | --- |
| `/` | Header · Hero · Ticker · Why · Features · Screens · Creators · FAQ · FinalCta · Footer | JSON‑LD: Organization, WebSite, SoftwareApplication ×2, FAQPage |
| `/download` | 4 אפשרויות התקנה + הוראות APK + עזרה | ראו §11 |
| `/legal/accessibility` | הצהרת נגישות מלאה | מאונדקס |
| `/legal/{terms,privacy,copyright}` | route אמיתי + הודעת ״טרם נמסר״ | `noindex` עד לנוסח מחייב |
| `/opengraph-image` | OG דינמי בעברית עם Ploni | Node runtime (קורא woff מ‑`public/`) |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | — | `llms.txt` הוא סיכום עובדתי למערכות AI |

`FAQPage` schema מוצהר **רק** בעמוד שבו השאלות באמת מרונדרות.

---

## 11. לוגיקת ההורדה

הרכיב המרכזי הוא `DownloadOptions`, והחוק שמנחה אותו:

> זיהוי הפלטפורמה **מדגיש** אפשרות אחת. הוא לעולם לא מסתיר, לא מסיר ולא מקטין
> אף אפשרות אחרת.

- `detectPlatform()` משתמש ב‑User‑Agent Client Hints עם נפילה ל‑UA. iPadOS
  מזוהה דרך `maxTouchPoints` כי הוא מדווח כ‑Mac.
- אין דרך אמינה לשאול דפדפן אם Google Play מותקן. הסיגנל שבו אנו משתמשים הוא
  WebView מצומצם ללא Chrome token. **בספק — מניחים ש‑Play קיים**, כי זו הטעות
  הניתנת לתיקון: כרטיס ה‑APK ממילא נמצא ממש מתחת.
- הרינדור בשרת נייטרלי; ההדגשה מופיעה רק אחרי הידרציה, ולכן אין hydration
  mismatch ואין CLS.
- ה‑APK מוצג ככרטיס מכובד ושווה‑ערך עם הוראות התקנה בשלושה צעדים — לא כפתרון
  עוקף.
- `StickyCta` מופיע במובייל אחרי גלילת ה‑Hero, מכבד `env(safe-area-inset-bottom)`,
  ו‑`main` שומר `padding-bottom` תואם כדי שלא יכסה את הפוטר לעולם.

---

## 12. נכסים

| תיקייה | מקור | מצב |
| --- | --- | --- |
| `public/fonts/` | Ploni מהלקוח | דורש אימות רישיון Web |
| `public/brand/` | קבצי לוגו ו‑favicon מהלקוח | סופי |
| `public/app/` | שני צילומי מסך מהאפליקציה (1440×2936) | סופי |
| `public/covers/` | 10 עטיפות שנחתכו מצילומי המסך ע"י `scripts/make-covers.mjs` | **מוקאפ בלבד** — דורש עטיפות מורשות |
| `public/atmos/` | 4 תמונות אווירה שנוצרו ב‑Higgsfield | סופי, בכפוף ל‑§5 |

`make-covers.mjs` הוא סקריפט חד‑פעמי הניתן להרצה חוזרת: הקואורדינטות של החיתוכים
מפורשות בקוד, כך שאפשר לכוונן ולהריץ מחדש בלי לגעת ביתר המערכת.

---

## 13. איך מוסיפים דברים

| משימה | היכן |
| --- | --- |
| שינוי טקסט | `src/content/site.ts` בלבד |
| סקשן חדש בעמוד הבית | רכיב ב‑`components/sections/` + תוכן ב‑`site.ts` + שורה ב‑`app/page.tsx` |
| אירוע אנליטיקס חדש | הוסף ל‑union ב‑`analytics.ts`, ואז השתמש דרך `CtaLink` |
| אייקון חדש | הוסף ל‑`GLYPHS` ב‑`Icon.tsx` — מיפוי אחד, לא import מפוזר |
| טוקן עיצוב חדש | `@theme` ב‑`globals.css`, ואם ה‑Design System נותן לו שם — גם alias ב‑`:root` |
| מעבר ל‑Sanity | החלף את ה‑exports ב‑`site.ts` בפונקציות שמחזירות את אותם טיפוסים |

---

## 14. אימות

```bash
npm run lint       # RTL check + eslint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

> **שימו לב:** אין להריץ `npm run build` בזמן ש‑`npm run dev` פעיל — הבילד דורס
> את `.next` ומשבית את שרת הפיתוח עם `Cannot find module './xxx.js'`. עצרו את
> ה‑dev, בנו, ואז הפעילו מחדש.

מה שנבדק בפועל בדפדפן: RTL, אפס גלישה אופקית ב‑320/768/1440, יחסי ניגודיות,
טעינת כל התמונות, JSON‑LD, היעדר `href` ריקים, היעדר פקדים ללא שם נגיש.

**מה שטרם נבדק ויזואלית:** התנהגות תלוית‑גלילה (header glass, sticky CTA,
scroll reveals) — נכונה מבנית אך לא אושרה בעין.
