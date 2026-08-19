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
  /**
   * As registered, ח״פ 514930460 — "יזמות ומסחר", not "מסחר ויזמות".
   * The order was the other way round here until it was checked against the
   * registry; it prints in the footer, the accessibility statement and the
   * legal pages, so it is worth keeping exact.
   */
  legalCompanyName: "לומדעת טכנולוגיות יזמות ומסחר בע״מ",
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

/**
 * Identifying details the legal pages print for the company behind the site.
 *
 * Same rule as apkRelease: anything null simply does not render, and nothing
 * here may be guessed. A privacy notice has to identify the entity holding the
 * data, so these carry weight.
 *
 * Name, number and address are the registered particulars (private Israeli
 * company, active, incorporated 5.6.2013). The address is the registered one —
 * public directories list כנפי נשרים 60, which is not what the registry says,
 * and a privacy notice should carry the registered address.
 *
 * `phone` stays null deliberately. The registry lists none, the number in the
 * directories is unverified, and this field renders as a channel for privacy
 * requests — which carry statutory response times. An email that works beats a
 * phone number that might not. See docs/OPEN_ITEMS.md #3ב.
 *
 * `dataRetentionMonths` is how long a contact submission is kept. It is a
 * commitment made to the visitor, so changing it changes the policy text.
 */
export const legalEntity: {
  companyId: string | null;
  address: string | null;
  phone: string | null;
  dataRetentionMonths: number;
} = {
  companyId: "514930460",
  address: "הרואה 19, ירושלים",
  phone: null,
  dataRetentionMonths: 24,
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

export const header = {
  cta: "האזינו עכשיו",
} as const;

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
  /**
   * Labels for the trivia card that illustrates the third feature. Deliberately
   * generic: the source design filled it with an invented song and invented
   * artist names, and this site does not put words in an artist's mouth or
   * invent a catalogue. Newly written, not from the approved design — see
   * docs/COPY_SUGGESTIONS.md. Swap in a real question once one is supplied.
   */
  demo: {
    label: "טריוויה מוזיקלית",
    question: "מי מבצע את השיר שמתנגן עכשיו?",
    options: ["אפשרות א׳", "אפשרות ב׳", "אפשרות ג׳"],
  },
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

/**
 * `id` is the submissions.type column; `event` is the existing analytics event
 * kept so the funnel does not break. Adding a topic here adds it everywhere.
 */
export const contact = {
  heading: "יש לכם רעיונות, בקשות או שאלות? דברו איתנו!",
  topics: [
    { id: "bug", icon: "bug_report", label: "דיווח על באג", event: "bug_report_click" },
    { id: "idea", icon: "lightbulb", label: "הצעת ייעול או רעיון", event: "idea_contact_click" },
    { id: "artist", icon: "mic", label: "הצטרפות אמנים", event: "artist_contact_click" },
    { id: "copyright", icon: "balance", label: "פנייה בנושא זכויות יוצרים", event: "copyright_contact_click" },
  ],
} as const;

/**
 * Form chrome. Newly written for the contact forms — not from the approved
 * design. Open to client edits, see docs/COPY_SUGGESTIONS.md.
 */
export const forms = {
  contact: {
    /** Modal intro per topic, keyed by contact.topics[].id. */
    intro: {
      bug: "ספרו לנו מה קרה ואיפה. ככל שנדע יותר, נתקן מהר יותר.",
      idea: "יש לכם רעיון שישפר את ג׳וזיק? נשמח לשמוע.",
      artist: "השאירו פרטים ונחזור אליכם בהקדם.",
      copyright: "פנייה בנושא זכויות יוצרים — נטפל בה בהקדם.",
    },
    fields: {
      name: "שם מלא",
      email: "אימייל",
      phone: "טלפון",
      phoneHint: "לא חובה. רק אם נוח לכם שנחזור אליכם טלפונית.",
      message: "ההודעה שלכם",
      topic: "נושא הפנייה",
    },
    consent: "קראתי ואני מאשר/ת את",
    consentLink: "מדיניות הפרטיות",
    submit: "שליחה",
    submitting: "שולח…",
    success: {
      title: "קיבלנו, תודה!",
      body: "הפנייה שלכם נשמרה ואנחנו נחזור אליכם למייל שהשארתם.",
      close: "סגירה",
    },
  },
} as const;

/**
 * /artists — the artist landing page.
 * Newly written copy built on the approved `creators` wording. No claim here
 * goes beyond what `creators.body` already says. See docs/COPY_SUGGESTIONS.md.
 */
export const artists = {
  meta: {
    title: "הצטרפות אמנים ויוצרים | Jusic",
    description:
      "אמנים, יוצרים ובעלי זכויות — השאירו פרטים והצוות של ג׳וזיק יחזור אליכם להקמת פרופיל אמן והעלאת תוכן.",
  },
  hero: {
    eyebrow: "לאמנים וליוצרים",
    headingA: "היצירה שלכם ראויה לבמה.",
    headingB: "ולכבוד.",
    body: "ב־Jusic אנחנו מאמינים בשקיפות מלאה ובשותפות אמיתית עם אמנים, יוצרים ובעלי זכויות. מודל התגמול שלנו דואג ליוצרים מהשקל הראשון, וכל יצירה מקבלת במה מכבדת בתוך סביבת תוכן יהודית איכותית.",
    cta: "למילוי הטופס",
  },
  why: {
    headingA: "למה להעלות",
    headingB: "את המוזיקה שלכם לג׳וזיק",
    items: [
      {
        icon: "balance",
        title: "תגמול מהשקל הראשון",
        body: "מודל התגמול שלנו דואג ליוצרים מהשקל הראשון, בשקיפות מלאה.",
      },
      {
        icon: "mic",
        title: "במה מכבדת",
        body: "כל יצירה מקבלת במה מכבדת בתוך סביבת תוכן יהודית איכותית.",
      },
      {
        icon: "lightbulb",
        title: "שותפות אמיתית",
        body: "רוצים לפתוח פרופיל אמן או לשמוע על אפשרויות שיתוף פעולה? נשמח להכיר אתכם.",
      },
    ],
  },
  how: {
    headingA: "איך זה",
    headingB: "עובד",
    steps: [
      {
        title: "משאירים פרטים",
        body: "ממלאים את הטופס בעמוד הזה עם קישור לחומרים שלכם.",
      },
      {
        title: "חוזרים אליכם",
        body: "הצוות שלנו עובר על הפנייה ויוצר איתכם קשר.",
      },
      {
        title: "מקימים פרופיל",
        body: "אנחנו מסייעים בהקמת פרופיל האמן ובהעלאת התוכן.",
      },
    ],
  },
  form: {
    headingA: "טופס",
    headingB: "הצטרפות",
    body: "השדות המסומנים בכוכבית הם חובה. שאר הפרטים עוזרים לנו להגיע מוכנים לשיחה.",
    sections: {
      contact: "פרטי קשר",
      artist: "פרטי האמן",
      catalog: "על הקטלוג",
    },
    fields: {
      stageName: "שם במה",
      genre: "סגנון",
      genrePlaceholder: "בחרו סגנון",
      primaryLink: "קישור לחומרים",
      primaryLinkHint: "יוטיוב, ספוטיפיי, דרייב או כל מקום שאפשר לשמוע בו את המוזיקה.",
      secondaryLink: "קישור נוסף",
      catalogSize: "כמה שירים יש בקטלוג?",
      catalogSizePlaceholder: "בחרו טווח",
      isDistributed: "האם המוזיקה שלכם מופצת היום בפלטפורמות דיגיטליות?",
      message: "משהו נוסף שנשמח לדעת",
    },
    genres: [
      { value: "chasidic", label: "חסידי" },
      { value: "mizrahi", label: "מזרחי" },
      { value: "pop", label: "פופ" },
      { value: "rock", label: "רוק" },
      { value: "cantorial", label: "חזנות" },
      { value: "instrumental", label: "אינסטרומנטלי" },
      { value: "kids", label: "ילדים" },
      { value: "lessons", label: "שיעורים ופודקאסטים" },
      { value: "other", label: "אחר" },
    ],
    catalogSizes: [
      { value: "1-5", label: "עד 5 שירים" },
      { value: "6-20", label: "6 עד 20" },
      { value: "21-50", label: "21 עד 50" },
      { value: "50+", label: "יותר מ־50" },
    ],
    distribution: [
      { value: "yes", label: "כן" },
      { value: "no", label: "לא" },
    ],
    submit: "שליחת הטופס",
    success: {
      title: "הטופס נשלח, תודה!",
      body: "הפנייה שלכם נשמרה. הצוות שלנו יעבור עליה ויחזור אליכם למייל שהשארתם.",
      back: "חזרה לדף הבית",
    },
  },
  faq: {
    headingA: "שאלות",
    headingB: "של אמנים",
    items: [
      {
        id: "artists-cost",
        question: "יש עלות להעלאת מוזיקה לג׳וזיק?",
        answer:
          "אין עלות להעלאת מוזיקה. מודל התגמול שלנו דואג ליוצרים מהשקל הראשון.",
      },
      {
        id: "artists-rights",
        question: "אני בעל זכויות ולא האמן עצמו. אפשר לפנות?",
        answer:
          "בהחלט. הטופס מיועד לאמנים, ליוצרים ולבעלי זכויות כאחד. ציינו בשדה ההערות מה הקשר שלכם לחומרים.",
      },
      {
        id: "artists-when",
        question: "תוך כמה זמן תחזרו אליי?",
        answer:
          "הצוות שלנו עובר על כל פנייה ויוצר קשר במייל שהשארתם בטופס.",
      },
    ],
  },
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
      icon: "google_play",
      title: "Google Play",
      body: "ההתקנה הרגילה למכשירי Android עם חנות Google Play, כולל עדכונים אוטומטיים.",
      cta: "התקינו מ־Google Play",
    },
    appStore: {
      icon: "app_store",
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
