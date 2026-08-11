import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { site } from "@/content/site";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Container className="pt-36 pb-24">
          <h1 className="mega text-[clamp(34px,4.4vw,64px)]">{title}</h1>
          {lastUpdated ? (
            <p className="mt-4 text-[13px] text-text-tertiary">
              עודכן לאחרונה: {lastUpdated}
            </p>
          ) : null}
          <div className="mt-10 max-w-[720px] space-y-5 text-[17px] leading-[1.8] text-text-secondary [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-text-primary [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6">
            {children}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

/** Marked stand-in for legal copy the client has not supplied yet. */
export function PendingCopy({ what }: { what: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-card)] p-5">
      <p className="m-0 text-[15px] text-text-secondary">
        טקסט {what} טרם נמסר לפרסום. עד לקבלת הנוסח המחייב, ניתן לפנות אלינו בכל
        שאלה בכתובת{" "}
        <a href={`mailto:${site.contactEmail}`} dir="ltr">
          {site.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
