import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { DownloadOptions } from "@/components/download/DownloadOptions";
import { CtaLink } from "@/components/ui/CtaLink";
import { JsonLd } from "@/components/shared/JsonLd";
import { softwareAppSchemas } from "@/lib/schema";
import { contact, download, mailto } from "@/content/site";

export const metadata: Metadata = {
  title: "הורדת האפליקציה",
  description:
    "Jusic זמינה בדפדפן, ב־Google Play, ב־App Store וכקובץ APK להתקנה ישירה במכשירים כשרים ללא חנות אפליקציות.",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return (
    <>
      <JsonLd data={softwareAppSchemas} />
      <SiteHeader />

      <main id="main">
        <section className="relative overflow-hidden">
          <Image
            src="/atmos/download.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.16]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgb(15 20 23 / 0.8), var(--bg))",
            }}
          />
          <Container className="relative pt-36 pb-14">
            <p className="m-0 text-[11px] font-bold tracking-[0.08em] text-cyan-400">
              {download.eyebrow}
            </p>
            <h1 className="mega mt-3">
              {download.headingA}
              <br />
              <span className="text-cyan-400">{download.headingB}</span>
            </h1>
            <p className="mt-6 max-w-[640px] text-[17px] leading-[1.6] text-text-secondary">
              {download.body}
            </p>
          </Container>
        </section>

        <Container className="pb-20">
          <DownloadOptions />
        </Container>

        <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <Container className="py-20">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.8fr_1.2fr]">
              <h2 className="m-0 font-[var(--font-display)] text-[clamp(28px,3.2vw,48px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
                {download.apkSteps.heading}
              </h2>
              <div>
                <ol className="m-0 list-none p-0">
                  {download.apkSteps.steps.map((step, i) => (
                    <li
                      key={step}
                      className="flex gap-4 border-t border-[var(--border)] py-5 first:border-t-0 first:pt-0"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-input)] text-[15px] font-bold text-cyan-400"
                      >
                        {i + 1}
                      </span>
                      <p className="m-0 text-[17px] leading-[1.6] text-text-secondary">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 mb-0 text-[15px] leading-[1.6] text-text-tertiary">
                  {download.apkSteps.note}
                </p>
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-20 text-center">
          <h2 className="m-0 font-[var(--font-display)] text-[clamp(24px,2.4vw,36px)] font-extrabold tracking-[-0.02em]">
            {download.help.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] text-[17px] text-text-secondary">
            {download.help.body}
          </p>
          <div className="mt-6 flex justify-center">
            <CtaLink
              href={mailto(contact.topics[0].label)}
              event="bug_report_click"
              placement="download"
              variant="outline"
              icon="bug_report"
              external={false}
            >
              {download.help.cta}
            </CtaLink>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
