import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/shared/LegalLayout";
import { ContactModalTrigger } from "@/components/forms/ContactModalTrigger";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "זכויות יוצרים",
  description:
    "מדיניות זכויות היוצרים של Jusic — כיצד להגיש הודעה על הפרת זכויות, מה עליה לכלול וכיצד היא מטופלת.",
  alternates: { canonical: "/legal/copyright" },
};

/**
 * Israeli law has no DMCA-style statutory notice-and-takedown, so this page
 * describes our own process and does not claim a safe harbour that does not
 * exist here. The notice requirements below are what we need in order to act,
 * not a statutory form.
 */
export default function CopyrightPage() {
  return (
    <LegalLayout title="זכויות יוצרים" lastUpdated="אוגוסט 2026">
      <p>
        מוזיקה נוצרת על ידי אנשים, וזכותם להיות בעליה ולהתפרנס ממנה. אנחנו
        מכבדים זכויות יוצרים ומצפים לאותו כבוד מכל מי שבא איתנו במגע. בעמוד הזה
        מוסבר כיצד לפנות אלינו אם נדמה לכם שנעשה שימוש ביצירה שלכם שלא כדין,
        וכיצד הפנייה מטופלת.
      </p>

      <h2>עמדתנו</h2>
      <p>
        אנחנו פועלים להעלות לשירות תכנים שיש לנו הרשאה להפיץ. אם למרות זאת הגיע
        לשירות תוכן שאינו מורשה — נטפל בכך. פנייה מנומקת של בעל זכויות תיבדק, ואם
        יימצא שהתוכן אכן הועלה ללא הרשאה הוא יוסר.
      </p>

      <h2>הודעה על הפרת זכויות</h2>
      <p>
        כדי שנוכל לטפל בפנייה במהירות ובלי סבב הבהרות, נבקש שתכלול את הפרטים
        הבאים:
      </p>
      <ul>
        <li>
          <strong>זיהוי היצירה</strong> — שם היצירה, שם היוצר או המבצע, ואם
          אפשר גם שנת יציאה או מזהה כגון <bdi>ISRC</bdi>.
        </li>
        <li>
          <strong>זיהוי התוכן המפר</strong> — היכן בשירות הוא מופיע: שם הפריט,
          קישור, או צילום מסך.
        </li>
        <li>
          <strong>הזכות שלכם ביצירה</strong> — האם אתם היוצר, בעל הזכויות, או
          מיופה כוח מטעמו; ואם מדובר בייצוג, מכוח מה.
        </li>
        <li>
          <strong>פרטי קשר</strong> — שם מלא, כתובת דוא&quot;ל, ואם אפשר גם
          טלפון, כדי שנוכל לחזור אליכם.
        </li>
        <li>
          <strong>הצהרה</strong> — שהפרטים שמסרתם נכונים, ושלמיטב ידיעתכם השימוש
          נעשה ללא הרשאה מבעל הזכויות או מכוח הדין.
        </li>
      </ul>

      <div className="mt-7">
        <ContactModalTrigger
          topic="copyright"
          label="פנייה בנושא זכויות יוצרים"
          event="copyright_contact_click"
          placement="legal"
          variant="primary"
          icon="balance"
        />
      </div>

      <h2>מה קורה אחרי הפנייה</h2>
      <p>
        אנחנו מאשרים קבלה ובודקים את הפנייה. אם היא כוללת את הפרטים הדרושים ועולה
        ממנה חשש ממשי להפרה, נפעל להסרת התוכן או להשעייתו עד לבירור, וניידע את
        הצד שהעלה אותו. אם חסרים פרטים — נחזור אליכם בבקשת השלמה.
      </p>
      <p>
        אם לדעתכם תוכן שלכם הוסר בטעות, כתבו לנו ונבחן את העניין מחדש. פנייה
        שתימצא כוזבת או קנטרנית עלולה לחשוף את שולחה לאחריות על פי דין.
      </p>

      <h2>יוצרים שמעוניינים להצטרף</h2>
      <p>
        העמוד הזה מיועד לטיפול בהפרות. אם אתם יוצרים ואתם רוצים שהמוזיקה שלכם
        תגיע לשירות — זה מסלול אחר לגמרי, ונשמח:{" "}
        <Link href="/artists">עמוד האמנים</Link>.
      </p>

      <h2>יצירת קשר</h2>
      <p>
        אפשר גם לכתוב לנו ישירות לכתובת{" "}
        <a href={`mailto:${site.contactEmail}`} dir="ltr">
          {site.contactEmail}
        </a>
        . ראו גם את <Link href="/legal/terms">תנאי השימוש</Link> ואת{" "}
        <Link href="/legal/privacy">מדיניות הפרטיות</Link>.
      </p>
    </LegalLayout>
  );
}
