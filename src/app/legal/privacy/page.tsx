import type { Metadata } from "next";
import { LegalLayout, PendingCopy } from "@/components/shared/LegalLayout";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של Jusic.",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="מדיניות פרטיות">
      <PendingCopy what="מדיניות הפרטיות" />
    </LegalLayout>
  );
}
