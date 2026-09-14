/**
 * Provider-agnostic analytics wrapper.
 *
 * Nothing in the app talks to GA4 / GTM / Vercel Analytics directly — everything
 * goes through `track()`. Swapping providers is a change to `dispatch()` only.
 * No provider is wired yet; see docs/OPEN_ITEMS.md.
 */

export type AnalyticsEvent =
  | "listen_web_click"
  | "google_play_click"
  | "app_store_click"
  | "apk_download_click"
  | "premium_click"
  | "artist_contact_click"
  | "copyright_contact_click"
  | "bug_report_click"
  | "idea_contact_click"
  | "faq_open"
  | "story_open"
  | "section_view"
  | "sticky_cta_click"
  // Contact and artist forms. form_open fires on the trigger, the rest on the
  // submit round trip, so open→submit→success is a funnel.
  | "form_open"
  | "form_submit"
  | "form_success"
  | "form_error";

/** Where on the page the interaction happened. Required on every event. */
export type Placement =
  | "hero"
  | "platforms"
  | "cta"
  | "footer"
  | "sticky"
  | "header"
  | "download"
  | "faq"
  | "artists"
  /** The stories band on the home page. */
  | "stories"
  /** The copyright form, reached from /legal/copyright rather than the footer. */
  | "legal";

export type EventParams = {
  placement: Placement;
  [key: string]: string | number | boolean | undefined;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const UTM_STORAGE_KEY = "jusic:utm";

/** Capture UTM params once per session so later events can carry attribution. */
export function captureUtm(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) found[key] = value;
    }
    if (Object.keys(found).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    }
  } catch {
    /* sessionStorage can be unavailable (private mode, blocked cookies) */
  }
}

/**
 * The attribution captured for this session. Also read by the contact forms,
 * which post it along with the submission so a lead can be traced to a campaign.
 */
export function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function dispatch(event: AnalyticsEvent, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  // GTM / GA4, if and when a container is present. Never loaded by us before LCP.
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...params });
  } else if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  } else if (process.env.NODE_ENV === "development") {
    // Dev-only visibility so events can be verified without a provider.
    console.info("[analytics]", event, params);
  }
}

export function track(event: AnalyticsEvent, params: EventParams): void {
  dispatch(event, { ...readUtm(), ...params });
}
