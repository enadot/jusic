import type { Metadata } from "next";
import { LegalLayout } from "@/components/shared/LegalLayout";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description:
    "הצהרת הנגישות של אתר Jusic — רמת הנגישות, ההתאמות שבוצעו ודרכי פנייה בנושא נגישות.",
  alternates: { canonical: "/legal/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalLayout title="הצהרת נגישות" lastUpdated="אוגוסט 2026">
      <p>
        אנחנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ופועלים כדי שאתר
        זה יהיה נגיש לאנשים עם מוגבלות.
      </p>

      <h2>רמת הנגישות באתר</h2>
      <p>
        האתר נבנה בהתאם לתקן הישראלי ת&quot;י 5568 ברמת התאמה AA, המבוסס על
        הנחיות הנגישות לתכני אינטרנט <span dir="ltr">WCAG 2.1</span> של ארגון{" "}
        <span dir="ltr">W3C</span>.
      </p>

      <h2>ההתאמות שבוצעו</h2>
      <ul>
        <li>מבנה סמנטי ותקין, המאפשר ניווט באמצעות קורא מסך.</li>
        <li>ניווט מלא באמצעות המקלדת, כולל סימון ברור של הפריט שבמיקוד.</li>
        <li>קישור דילוג לתוכן הראשי בתחילת כל עמוד.</li>
        <li>יחסי ניגודיות העומדים בדרישות התקן לטקסט ולרכיבי ממשק.</li>
        <li>טקסט חלופי לתמונות בעלות משמעות, ותיאור בעברית לכל כפתור אייקון.</li>
        <li>
          כיבוד העדפת המערכת <span dir="ltr">prefers-reduced-motion</span>:
          כאשר היא מופעלת, אפקטי התנועה באתר מבוטלים.
        </li>
        <li>התאמה למגוון גדלי מסך, כולל מכשירים ניידים.</li>
      </ul>

      <h2>מגבלות ידועות</h2>
      <p>
        ייתכן שיימצאו באתר רכיבים שטרם הונגשו במלואם. אנחנו ממשיכים לבדוק ולשפר
        את הנגישות באופן שוטף, ונשמח לתקן כל ליקוי שיובא לידיעתנו.
      </p>

      <h2>פנייה בנושא נגישות</h2>
      <p>
        נתקלתם בבעיית נגישות באתר? נשמח לשמוע. ניתן לפנות אלינו בדוא&quot;ל{" "}
        <a
          href="mailto:editor@jusic.co?subject=%D7%A4%D7%A0%D7%99%D7%99%D7%94%20%D7%91%D7%A0%D7%95%D7%A9%D7%90%20%D7%A0%D7%92%D7%99%D7%A9%D7%95%D7%AA"
          dir="ltr"
        >
          {site.contactEmail}
        </a>
        , ונטפל בפנייה בהקדם.
      </p>

      <h2>פרטי הארגון</h2>
      <p>{site.legalCompanyName}</p>
    </LegalLayout>
  );
}
