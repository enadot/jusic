import type { Metadata } from "next";
import { LegalLayout, PendingCopy } from "@/components/shared/LegalLayout";

export const metadata: Metadata = {
  title: "זכויות יוצרים",
  description: "מדיניות זכויות היוצרים של Jusic ודרכי פנייה בנושא.",
  alternates: { canonical: "/legal/copyright" },
  robots: { index: false },
};

export default function CopyrightPage() {
  return (
    <LegalLayout title="זכויות יוצרים">
      <PendingCopy what="מדיניות זכויות היוצרים" />
    </LegalLayout>
  );
}
