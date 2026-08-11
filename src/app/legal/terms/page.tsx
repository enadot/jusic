import type { Metadata } from "next";
import { LegalLayout, PendingCopy } from "@/components/shared/LegalLayout";

export const metadata: Metadata = {
  title: "תקנון ותנאי שימוש",
  description: "תקנון ותנאי השימוש בשירותי Jusic.",
  alternates: { canonical: "/legal/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalLayout title="תקנון ותנאי שימוש">
      <PendingCopy what="התקנון ותנאי השימוש" />
    </LegalLayout>
  );
}
