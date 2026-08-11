/**
 * Single source of truth for every user-facing string on jusic.co.
 *
 * Copy is lifted verbatim from the approved design "Jusic Home F - Kinetic Type".
 * Do not rewrite it here. Wording concerns go to docs/COPY_SUGGESTIONS.md.
 *
 * When Sanity lands, this module becomes the shape the GROQ queries return —
 * the components should not need to change.
 */

export const site = {
  name: "Jusic",
  wordmark: "JUSIC",
  legalCompanyName: "לומדעת טכנולוגיות מסחר ויזמות בע״מ",
  contactEmail: "editor@jusic.co",
  copyrightYear: 2026,
  url: "https://jusic.co",
  title: "Jusic – מוזיקה יהודית חכמה, נקייה ומותאמת אישית",
  description:
    "האזינו למוזיקה יהודית חדשה ונוסטלגית, פלייליסטים אישיים, סטוריז של אמנים, משחקים, פודקאסטים ושיעורי תורה — הכול במקום אחד.",
} as const;

/** Platform destinations. Single source of truth — never inline a URL. */
export const links = {
  web: "https://jusic.app",
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.lomdaat.apps.music",
  appStore: "https://apps.apple.com/il/app/jusic/id6762372342?l=he",
  /**
   * Interim location supplied with the approved design.
   * An official, versioned APK URL is an open item — see docs/OPEN_ITEMS.md.
   * Leave this empty and the APK control renders as "בקרוב" instead of linking.
   */
  apk: "https://drive.google.com/drive/folders/1G4rw2SkBe5HcneN41NKrhPgH7OHdW0Tm?usp=drive_link",
} as const;

/**
 * APK release metadata. Every field is unverified until the client supplies it,
 * so anything left null simply does not render. Never invent a value here.
 */
export const apkRelease: {
  version: string | null;
  releaseDate: string | null;
  fileSize: string | null;
} = {
  version: null,
  releaseDate: null,
  fileSize: null,
};

export const mailto = (subject: string) =>
  `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}`;

export const nav = [
  { label: "למה Jusic", href: "/#why" },
  { label: "מה מחכה לכם", href: "/#features" },
  { label: "לאמנים וליוצרים", href: "/#creators" },
  { label: "שאלות נפוצות", href: "/#faq" },
  { label: "יצירת קשר", href: "/#contact" },
] as const;

export const hero = {
  /** Rendered as one H1; the artwork chips sit between the fragments. */
  lines: {
    a: "כל",
    b: "המוזיקה היהודית",
    c: "במקום",
    d: "אחד.",
    e: "בדיוק כמו",
    f: "שאתם אוהבים.",
  },
  body: "שירים חדשים ונוסטלגיים, פלייליסטים אישיים, סטוריז, משחקי טריוויה, שיעורים ופודקאסטים — באפליקציה חכמה, נקייה ומותאמת אישית.",
  ctas: {
    web: "האזינו עכשיו ב־Web",
    googlePlay: "Google Play",
    appStore: "App Store",
    apk: "קובץ APK למכשירים כשרים",
  },
} as const;

export const tickerWords = [
  "מוזיקה יהודית מקורית",
  "המלצות חכמות",
  "תוכן נקי",
  "כבוד ליוצרים",
  "פלייליסט אישי",
  "סטוריז נבחרים",
  "משחקי טריוויה",
] as const;

export const why = {
  headingA: "חוויה נקייה.",
  headingB: "לכל המשפחה.",
  body: "ג׳וזיק, מבית ״לומדעת״, היא פלטפורמת התוכן היהודית המובילה. יצרנו עבורכם סביבה טכנולוגית מתקדמת, נקייה ב־100% ומבוקרת. מנוי חינמי נהנה מהאזנה רציפה עם פרסומות שמע איכותיות בלבד — ללא פרסומות קופצות וללא מסיחים שפוגעים בחוויה.",
} as const;

export const features = {
  headingA: "מה מחכה",
  headingB: "לכם?",
  items: [
    {
      cover: 2,
      title: "בשבילך",
      body: "מערכת המלצות חכמה שלומדת את הטעם שלך ויוצרת פלייליסטים אישיים שמתאימים בול לכל מצב רוח.",
    },
    {
      cover: 5,
      title: "יותר ממוזיקה",
      body: "עולם של תוכן עדכני ומסונן בקפידה: סטוריז מאמנים בארץ ובעולם, שיעורי תורה, רדיו חי ופודקאסטים מרתקים.",
    },
    {
      cover: 8,
      title: "קהילה ומשחק",
      body: "חוויה לכל המשפחה עם משחקי טריוויה מוזיקליים, אפשרות לשחק מול יריבים אמיתיים ופתיחת חדרים לקבוצות.",
    },
    {
      cover: 3,
      title: "סטוריז",
      body: "סטוריז נבחרים של אמנים מהארץ ומהעולם, מסוננים ומותאמים — רק מה שחשוב ומעניין.",
    },
    {
      cover: 9,
      title: "כבוד ליוצרים",
      body: "אנחנו מאמינים בשקיפות מלאה. מודל התגמול שלנו דואג ליוצרים מהשקל הראשון.",
    },
  ],
} as const;

export const screens = {
  headingA: "נראית טוב.",
  headingB: "נשמעת עוד יותר טוב.",
  alt: "מסך מתוך אפליקציית Jusic",
} as const;

export const creators = {
  headingA: "היצירה שלכם ראויה לבמה.",
  headingB: "ולכבוד.",
  body: "ב־Jusic אנחנו מאמינים בשקיפות מלאה ובשותפות אמיתית עם אמנים, יוצרים ובעלי זכויות. מודל התגמול שלנו דואג ליוצרים מהשקל הראשון, וכל יצירה מקבלת במה מכבדת בתוך סביבת תוכן יהודית איכותית. רוצים להעלות מוזיקה, לפתוח פרופיל אמן או לשמוע על אפשרויות שיתוף פעולה? נשמח להכיר אתכם.",
  cta: "הצטרפות אמנים",
} as const;

export const faq = {
  headingA: "שאלות",
  headingB: "נפוצות",
  items: [
    {
      id: "pricing-free",
      question: "האם השימוש באפליקציה עולה כסף?",
      answer:
        "האפליקציה ניתנת להורדה ולשימוש בחינם! המסלול החינמי כולל פרסומות שמע איכותיות, ללא פרסומות ויזואליות קופצות.",
    },
    {
      id: "premium",
      question: "כמה עולה מנוי פרימיום ומה מקבלים בו?",
      answer:
        "מנוי פרימיום מעניק חוויה חלקה וללא פרסומות. בהמשך יתווספו למנויי פרימיום פיצ'רים נוספים, ובהם הורדה להאזנה במצב אופליין, בקרת הורים ועוד. מחיר מנוי פרימיום כיום הוא 19.90 ₪, וניתן לבטל אותו בכל עת.",
    },
    {
      id: "content-types",
      question: "אילו סוגי תוכן אפשר למצוא בג'וזיק?",
      answer:
        "מעבר למאגר מוזיקה ענק, תמצאו אצלנו סטוריז מסוננים של אמנים, פודקאסטים, שיעורי תורה, רדיו ומשחקי טריוויה מוזיקליים.",
    },
    {
      id: "kosher-install",
      question: "איך מתקינים את האפליקציה במכשיר כשר ללא חנות Google Play?",
      answer:
        "פשוט מאוד. לוחצים כאן באתר על הכפתור ״הורדת קובץ APK״, והקובץ יורד ישירות למכשיר. לאחר מכן נכנסים לסייר הקבצים ומתקינים אותו בלחיצה.",
    },
    {
      id: "artists-join",
      question: "אני אמן או יוצר. איך מעלים את המוזיקה שלי?",
      answer:
        "לוחצים על הכפתור ״הצטרפות אמנים״ בתחתית האתר ושולחים לנו הודעת דוא״ל. הצוות שלנו יחזור אליכם ויסייע בהקמת פרופיל האמן ובהעלאת התוכן.",
    },
  ],
} as const;

export const finalCta = {
  headingA: "המוזיקה שלכם",
  headingB: "כבר מחכה.",
  body: "הצטרפו ל־Jusic וגלו מוזיקה יהודית חדשה ונוסטלגית, תוכן איכותי והמלצות שמכירות את הטעם שלכם.",
  ctas: {
    web: "התחילו להאזין",
    android: "הורידו ל־Android",
    ios: "הורידו ל־iPhone",
  },
} as const;

export const contact = {
  heading: "יש לכם רעיונות, בקשות או שאלות? דברו איתנו!",
  topics: [
    { icon: "bug_report", label: "דיווח על באג", event: "bug_report_click" },
    { icon: "lightbulb", label: "הצעת ייעול או רעיון", event: "idea_contact_click" },
    { icon: "mic", label: "הצטרפות אמנים", event: "artist_contact_click" },
    { icon: "balance", label: "פנייה בנושא זכויות יוצרים", event: "copyright_contact_click" },
  ],
} as const;

export const legalLinks = [
  { label: "תקנון ותנאי שימוש", href: "/legal/terms" },
  { label: "מדיניות פרטיות", href: "/legal/privacy" },
  { label: "הצהרת נגישות", href: "/legal/accessibility" },
  { label: "זכויות יוצרים", href: "/legal/copyright" },
] as const;

export const copyrightLine = `כל הזכויות שמורות לג׳וזיק (${site.legalCompanyName}), ${site.copyrightYear}.`;

/** Public path for a mockup cover tile. */
export const cover = (n: number) =>
  `/covers/cover-${String(n).padStart(2, "0")}.jpg`;

/* ---------------------------------------------------------------------------
   /download — the dedicated install page
   --------------------------------------------------------------------------- */

export const download = {
  eyebrow: "הורדה והתקנה",
  headingA: "כל הדרכים",
  headingB: "להאזין.",
  body: "Jusic זמינה בדפדפן, ב־Google Play, ב־App Store וכקובץ APK להתקנה ישירה במכשירים כשרים ללא חנות אפליקציות. בחרו את מה שמתאים לכם — כל האפשרויות פתוחות.",
  recommendedLabel: "מומלץ למכשיר שלכם",
  options: {
    web: {
      icon: "language",
      title: "האזנה בדפדפן",
      body: "נכנסים ומתחילים לשמוע, בלי להתקין כלום. עובד במחשב ובנייד.",
      cta: "פתחו את Jusic ב־Web",
    },
    googlePlay: {
      icon: "android",
      title: "Google Play",
      body: "ההתקנה הרגילה למכשירי Android עם חנות Google Play, כולל עדכונים אוטומטיים.",
      cta: "התקינו מ־Google Play",
    },
    appStore: {
      icon: "phone_iphone",
      title: "App Store",
      body: "לאייפון ולאייפד, ישירות מחנות האפליקציות של Apple.",
      cta: "התקינו מ־App Store",
    },
    apk: {
      icon: "download",
      title: "קובץ APK למכשירים כשרים",
      body: "למכשירי Android ללא חנות Google Play. התקנה ישירה של הקובץ מהמכשיר.",
      cta: "הורדת קובץ APK",
      soon: "בקרוב",
    },
  },
  apkSteps: {
    heading: "איך מתקינים את קובץ ה־APK",
    steps: [
      "לוחצים על ״הורדת קובץ APK״ בעמוד הזה, והקובץ יורד ישירות למכשיר.",
      "נכנסים לסייר הקבצים במכשיר ומאתרים את הקובץ שהורד.",
      "לוחצים על הקובץ ומאשרים את ההתקנה.",
    ],
    note: "אם המכשיר מבקש אישור להתקנה ממקור חיצוני — זהו שלב רגיל בהתקנה ידנית של אפליקציה.",
  },
  help: {
    heading: "נתקעתם באמצע?",
    body: "כתבו לנו ונעזור לכם להתקין.",
    cta: "דיווח על באג",
  },
  stickyCta: "הורידו את Jusic",
} as const;
