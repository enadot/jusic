/**
 * Client-side platform detection for the download recommendation.
 *
 * This only ever *reorders* and highlights — every install option stays visible
 * and reachable regardless of what we detect. A wrong guess must never hide a path.
 */

export type Platform = "ios" | "android-play" | "android-no-play" | "desktop";

type NavigatorUAData = {
  platform?: string;
  mobile?: boolean;
  brands?: { brand: string; version: string }[];
};

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";

  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData })
    .userAgentData;
  const ua = navigator.userAgent || "";

  const isIOS =
    uaData?.platform === "iOS" ||
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports as a Mac; touch points give it away.
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";

  const isAndroid = uaData?.platform === "Android" || /Android/.test(ua);
  if (isAndroid) {
    return hasLikelyPlayServices(ua) ? "android-play" : "android-no-play";
  }

  return "desktop";
}

/**
 * There is no reliable way to ask a browser whether Google Play exists on the
 * device. Kosher/de-Googled Android builds ship browsers that either omit the
 * Chrome token entirely or run a stripped WebView, so that is the signal we use.
 * When in doubt we assume Play is present — Play is the recoverable wrong guess,
 * because the APK card is right underneath it either way.
 */
function hasLikelyPlayServices(ua: string): boolean {
  const isStrippedWebView = /\bwv\b/.test(ua) && !/Chrome\/\d+/.test(ua);
  if (isStrippedWebView) return false;
  return /Chrome\/\d+|Firefox\/\d+|SamsungBrowser|EdgA|OPR/.test(ua);
}
