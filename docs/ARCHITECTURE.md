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
| Claude Design project `750b974f`, variant **`Jusic Home E - Immersive Split`** | הפריסה, הטיפוגרפיה והטקסטים של עמוד הבית |
| `jusic-design-system-bd48b83e` (`readme.md` + `tokens/`) | חוקי השפה הוויזואלית — צבע, צורה, תנועה, טיפוגרפיה |

מסמך העיצוב וה‑Design System גוברים בשאלות ויזואליות; הבריף גובר בשאלות של
Stack, תוכן, נגישות ומדידה. שתי סתירות שהתגלו בין השניים תועדו והוכרעו במפורש
ב‑`OPEN_ITEMS.md` (אייקונים, פונט).

---

## 3. Stack ומבנה

Next.js 16 App Router · TypeScript strict · Tailwind CSS v4 (CSS‑first) ·
`lucide-react` · npm · Vercel.
נתונים: **Neon Postgres + Drizzle**. אימות דשבורד: **Neon Auth**. ולידציה: `zod`.

**אין**: Sanity (בשלב זה), shadcn/ui, Magic UI, CSS‑in‑JS. `gsap` הוא ספריית
האנימציה היחידה, ורק בעמוד הבית — ראו §9.

`drizzle-orm`, `@neondatabase/serverless`, `zod` ו‑`@neondatabase/auth` הם
**server‑only** — הם לא מגיעים ל‑bundle של אף עמוד שיווקי, וזה נבדק בכל build.
ערכת ה‑UI של Neon Auth (`@neondatabase/auth-ui`) נבחנה ונדחתה: היא גוררת
next‑themes ו‑shadcn ומתנגשת עם מערכת עיצוב שהיא dark‑only ו‑RTL. מסך ההתחברות
בנוי מ‑`Button`/`Field` הקיימים מול `auth.signIn.email`.

**למה Next 16:** כל גרסאות `@neondatabase/auth` דורשות `next >= 16`. השדרוג
מ‑15.5 נעשה בשביל זה. שתי השלכות מעשיות: `middleware.ts` נקרא עכשיו `proxy.ts`,
ו‑`agentRules: false` ב‑`next.config.ts` מונע מ‑Next להוסיף בלוק הנחיות משלו
ל‑`CLAUDE.md` בכל `next dev`.

```
src/
├── app/                    routes בלבד — כל route רזה ומרכיב סקשנים
│   ├── page.tsx            עמוד הבית
│   ├── download/           עמוד ההורדה
│   ├── artists/            עמוד ההצטרפות לאמנים + טופס מלא
│   ├── admin/              לוח הבקרה — layout נפרד, noindex, force-dynamic
│   ├── api/auth/[...path]/ proxy ל‑Neon Auth
│   ├── api/form-token/     מנפיק את חותמת הזמן החתומה של הטפסים
│   ├── legal/{4}/          עמודים משפטיים
│   ├── layout.tsx          html/dir/lang, פונט, skip link, metadata גלובלי
│   ├── opengraph-image.tsx OG דינמי (next/og, Node runtime)
│   ├── sitemap.ts robots.ts
├── components/
│   ├── ui/                 Button, CtaLink, Icon, Reveal
│   ├── sections/           סקשן אחד לכל חלק בעמוד הבית
│   ├── download/           DownloadOptions
│   ├── forms/              ContactModalTrigger, ContactForm
│   ├── artists/            סקשנים + ArtistForm
│   ├── admin/              Shell, Pieces, Filters, SignInForm, DbError
│   └── shared/             Container, StickyCta, JsonLd, LegalLayout, UtmCapture
├── content/site.ts         כל הטקסטים
├── lib/                    analytics, platform, schema, cn, formState, formToken
├── server/                 הכול server-only
│   ├── db/                 schema + client (drizzle/neon-http)
│   ├── queries/            קריאות לדשבורד + פענוח searchParams
│   ├── actions/            server actions (טפסים ציבוריים + פעולות דשבורד)
│   ├── auth.ts             Neon Auth + requireAdmin() + allowlist
│   ├── validation.ts       סכמות zod
│   ├── spam.ts             honeypot, חותמת חתומה, מכסה לפי IP
│   └── webhook.ts          שליחה ל‑Make
├── styles/globals.css      טוקנים + base
└── proxy.ts                שומר על /admin (middleware של Next 16)
drizzle/                    מיגרציות שנוצרו, נכנסות ל‑git
```

`proxy.ts` יושב **בתוך `src/`**, ליד `app/` — שם Next מחפש אותו. בשורש
הפרויקט אף אחד לא טוען אותו ואף אחד לא מתלונן: הבנייה עוברת, `requireAdmin()`
עדיין שומר על כל עמוד, ורק חזרת ה‑OAuth נשברת בשקט. `npm run lint` נכשל אם
הקובץ זז.

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
   (`.mega`, `.kw`, `.outline-word`, `.rv`, `.skip-link`).

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
- WebP, 10–44KB כל אחת, ואף אחת מהן אינה `priority`.

עם המעבר ל‑`Jusic Home E` עמוד הבית עבר לרקע שטוח, ולכן `atmos/hero.webp`
ו‑`atmos/why.webp` ירדו ממנו. נשארו `atmos/download.webp` בעמוד ההורדה
ו‑`atmos/creators.webp` מעל ה‑gradient בסקשן היוצרים. ה‑`priority` היחיד
בעמוד הבית הוא כעת צילום המסך הקדמי בהירו.

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
| Initial JS | **~152 kB** (תקציב 150 kB — ראו הערה) |
| RSC by default | `"use client"` רק בעלים: `SiteHeader`, `Faq`, `Reveal`, `CtaLink`, `StickyCta`, `DownloadOptions`, `UtmCapture`, `HomeMotion` (מחזיר `null`) |
| תמונות | `next/image` בכל מקום, AVIF/WebP, `priority` ל‑Hero בלבד |
| אנימציה | CSS + `IntersectionObserver` בכל האתר. `gsap` + `ScrollTrigger` **רק ב‑`/`**, ב‑`import()` דינמי על idle — ~47KB gz בצ'אנק נפרד, מחוץ ל‑Initial JS של כל route. `ogl` (רקע ה‑WebGL של ההירו) באותה שיטה בדיוק, ורק כשאין `prefers-reduced-motion` |
| פונטים | משפחה אחת, self‑hosted, `swap` |

`Reveal` משמש גם כטריגר ל‑`section_view`, כדי לא להריץ observer שני על אותם
אלמנטים.

### על חריגת התקציב

התקציב נקבע מול Next 15. מדידה של אותו עמוד לפני ואחרי, באותה שיטה:

| | `/` | route בלי רכיבים (`_not-found`) |
| --- | --- | --- |
| Next 15 (לפני) | 155.3 KB gz | 139.7 KB gz |
| Next 16 + טפסים | 188.8 KB gz | 169.9 KB gz |

הדלתא ב‑route שאין בו שום רכיב היא **30.2KB** — כלומר כמעט כל הגידול הוא
runtime של Next 16 ו‑React 19.2, לא הקוד שנוסף. תרומת הטפסים לעמוד הבית היא
**כ‑3KB**, כי המודל עצמו נטען ב‑`next/dynamic` רק בלחיצה הראשונה.

זו ההשלכה של שדרוג שנעשה כדי לאפשר את Neon Auth. אם התקציב חייב לחזור
ל‑150KB, ההחלטה לבחון היא Next 16 — לא הטפסים.

---

## 10. עמודים

| נתיב | מה יש בו | הערות |
| --- | --- | --- |
| `/` | Header · Hero · Ticker · Why · Features · Screens · Creators · FAQ · FinalCta · Footer | JSON‑LD: Organization, WebSite, SoftwareApplication ×2, FAQPage |
| `/download` | 4 אפשרויות התקנה + הוראות APK + עזרה | ראו §11. ״דיווח על באג״ פותח מודל |
| `/artists` | Hero · למה להצטרף · איך זה עובד · טופס · FAQ | הקופי בנוי על `creators` המאושר. **לא** ב‑`nav` — ראו OPEN_ITEMS #16 |
| `/admin/*` | סקירה · כל הפניות · הצטרפות אמנים · פנייה בודדת · ייצוא CSV | `noindex`, `force-dynamic`, מוגן ב‑`proxy.ts` **וגם** ב‑`requireAdmin()` |
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

## 11א. טפסים, נתונים ולוח הבקרה

### מה קורה כשמישהו שולח טופס

```
כפתור  →  Modal (native <dialog>)  →  ContactForm  →  submitContact()
                                                          ├── zod
                                                          ├── spam.checkSubmission()
                                                          ├── insert ל‑Neon
                                                          └── after() → webhook ל‑Make
```

`/artists` זהה, רק בלי המודל ועם `submitArtist()`.

### למה `<dialog>` נייטיבי

הפלטפורמה נותנת בחינם את החלקים הקשים: מלכודת פוקוס, סגירה ב‑Esc, `inert` על
הרקע, ו‑**top layer** — כלומר אין מלחמת z‑index מול ה‑header (`z-20`) או
ה‑StickyCta (`z-30`). התצוגה היא bottom sheet מתחת ל‑640px וכרטיס ממורכז מעליו,
והאנימציה משתמשת ב‑`--dur-sheet` שהוגדר במערכת העיצוב ולא היה לו צרכן עד עכשיו.

### שתי מלכודות שנתגלו בבנייה

1. **מודול `"use server"` יכול לייצא רק פונקציות async.** `IDLE_STATE` ישב שם
   בהתחלה והפיל את כל הטפסים ב‑runtime. הוא הועבר ל‑`src/lib/formState.ts`.
2. **React 19 מאפס טופס לא‑מבוקר אחרי שה‑action מסתיים.** בלי טיפול, כל שגיאת
   ולידציה הייתה מוחקת את מה שהמבקר הקליד. לכן `FormState.values` מחזיר את
   הערכים והשדות מקבלים אותם כ‑`defaultValue` — האיפוס נוחת על מה שנשלח.

### חותמת הזמן והסטטיות

`createStamp()` **לא** נקרא בזמן רינדור: עמוד הבית ו‑`/artists` מרונדרים
סטטית, ולכן חותמת מזמן ה‑build הייתה בת שעות אצל כל מבקר. במקום זה
`/api/form-token` מנפיק אותה, והטופס מושך אותה כשהוא נטען — כלומר בפתיחת המודל.
כך העמודים נשארים סטטיים והבקשה קורית רק למי שבאמת פתח טופס.

### הגנת ספאם — שלוש שכבות, אפס חיכוך למשתמש

| שכבה | מה היא תופסת | התנהגות |
| --- | --- | --- |
| honeypot (`website`) | בוט שממלא כל שדה | דחייה שקטה, הודעה גנרית |
| חותמת חתומה HMAC | טופס שנקצר או שנשלח מחוץ לחלון של שעתיים | דחייה |
| מכסה לפי `ipHash` | 5 פניות לשעה מאותו מכשיר | הודעה ידידותית |

חתימה פגומה או טופס ישן = דחייה. שליחה **מהירה מדי** (< 1.2 שנייה) היא סיגנל
חלש בלבד ולכן מקבלת מסלול נפרד וניתן לניסיון חוזר — הודעה קצרה, והניסיון הבא
עובר, כי החותמת נוצרת פעם אחת לכל טופס. אין captcha.

ה‑IP הגולמי **לא נשמר לעולם** — רק `sha256(ip + IP_HASH_SALT)`.

### Webhook ל‑Make

רץ ב‑`after()`, כלומר אחרי שהתשובה כבר בדרך למשתמש, וכל כישלון נבלע ונרשם ללוג.
פנייה שנשמרה בהצלחה ב‑DB לא תוצג כשגיאה רק בגלל ש‑Make לא זמין. אם
`MAKE_WEBHOOK_SECRET` מוגדר, ה‑body נחתם ב‑`x-jusic-signature` (HMAC‑SHA256).

### מודל הנתונים

טבלה אחת, `submissions`. ארבעת נושאי הפוטר וטופס האמנים נבדלים רק ב‑`type`
ובמה שיושב ב‑`payload` (jsonb), כדי שהדשבורד יהיה רשימה אחת שאפשר לסנן.
`type` ו‑`status` הם `text` ולא enum בכוונה: הוספת נושא היא שינוי תוכן, לא מיגרציה.

### הרשאות הדשבורד — שני שערים

`proxy.ts` בולם בקשות אנונימיות לפני הרינדור, אבל הוא **לא** השער היחיד:
`requireAdmin()` רץ בכל עמוד ובכל פעולה ובודק גם את ה‑allowlist, שה‑middleware
לא רואה. Neon Auth מאפשר לכל אחד להירשם, ולכן בלי `ADMIN_EMAILS` תיבת הפניות
הייתה פתוחה. רשימה ריקה נועלת את כולם.

מסלול הייצוא (`/admin/submissions/export`) הוא route handler ולכן לא נהנה
מחוזה ההפניה של `requireAdmin()` — הוא בודק את שני החלקים בעצמו ומחזיר 401.

### הסינון בדשבורד

הפילטרים הם טופס GET והמצב חי ב‑`searchParams`, לא ב‑state. שלוש תוצאות:
כל תצוגה ניתנת לשיתוף בקישור, הרשימות נשארות RSC בלי JS, וייצוא ה‑CSV משתמש
באותה מחרוזת שאילתה בדיוק. `parseFilters()` מסנן ברשימת היתר, כך ש‑URL ערוך
ביד יכול רק לצמצם תוצאות.

ה‑CSV נכתב עם BOM של UTF‑8 — בלעדיו Excel פותח את העברית כג׳יבריש.

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
