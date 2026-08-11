"use client";

import { useSyncExternalStore } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { detectPlatform, type Platform } from "@/lib/platform";
import type { AnalyticsEvent } from "@/lib/analytics";
import { apkRelease, download, links } from "@/content/site";

type OptionKey = "web" | "googlePlay" | "appStore" | "apk";

const OPTIONS: {
  key: OptionKey;
  href: string;
  event: AnalyticsEvent;
  copy: { icon: string; title: string; body: string; cta: string };
}[] = [
  {
    key: "web",
    href: links.web,
    event: "listen_web_click",
    copy: download.options.web,
  },
  {
    key: "googlePlay",
    href: links.googlePlay,
    event: "google_play_click",
    copy: download.options.googlePlay,
  },
  {
    key: "appStore",
    href: links.appStore,
    event: "app_store_click",
    copy: download.options.appStore,
  },
  {
    key: "apk",
    href: links.apk,
    event: "apk_download_click",
    copy: download.options.apk,
  },
];

/** Which option we highlight. Nothing is ever hidden or reordered away. */
const RECOMMENDED: Record<Platform, OptionKey> = {
  ios: "appStore",
  "android-play": "googlePlay",
  "android-no-play": "apk",
  desktop: "web",
};

/** The user agent never changes while the page is open, so there is nothing
 *  to subscribe to. useSyncExternalStore (rather than an effect) is what keeps
 *  the server snapshot neutral without a cascading re-render on mount. */
const neverChanges = () => () => {};
const serverSnapshot = (): OptionKey | null => null;
const clientSnapshot = (): OptionKey | null => RECOMMENDED[detectPlatform()];

export function DownloadOptions() {
  // Render neutral on the server; highlight only once we know the device.
  const recommended = useSyncExternalStore(
    neverChanges,
    clientSnapshot,
    serverSnapshot,
  );

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
      {OPTIONS.map((option) => {
        const isRecommended = recommended === option.key;
        const apkUnavailable = option.key === "apk" && !links.apk;

        return (
          <li
            key={option.key}
            className={cn(
              "flex flex-col gap-4 rounded-[20px] border p-5 transition-colors duration-[var(--dur-base)]",
              "bg-[var(--surface-card)] shadow-[var(--shadow-card)]",
              isRecommended
                ? "border-cyan-500"
                : "border-white/[0.06] hover:bg-[#20272a]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-input)] text-cyan-400">
                <Icon name={option.copy.icon as IconName} size={22} />
              </span>
              {isRecommended ? (
                <span className="rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-bold text-text-on-cyan">
                  {download.recommendedLabel}
                </span>
              ) : null}
            </div>

            <div>
              <h3 className="m-0 text-[22px] font-bold">{option.copy.title}</h3>
              <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-text-secondary">
                {option.copy.body}
              </p>
              {option.key === "apk" && apkRelease.version ? (
                <p
                  dir="ltr"
                  className="mt-2 mb-0 text-start text-[13px] text-text-tertiary"
                >
                  {[apkRelease.version, apkRelease.releaseDate, apkRelease.fileSize]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : null}
            </div>

            <div className="mt-auto">
              {apkUnavailable ? (
                <Button variant="outline" disabled aria-disabled="true">
                  {download.options.apk.soon}
                </Button>
              ) : (
                <CtaLink
                  href={option.href}
                  event={option.event}
                  placement="download"
                  eventParams={{ recommended: isRecommended }}
                  variant={isRecommended ? "primary" : "outline"}
                  icon={option.copy.icon as IconName}
                >
                  {option.copy.cta}
                </CtaLink>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
