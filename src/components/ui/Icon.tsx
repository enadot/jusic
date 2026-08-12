import {
  Bug,
  Download,
  Globe,
  Lightbulb,
  Mic,
  Play,
  Scale,
  type LucideIcon,
} from "lucide-react";

function BrandMark({
  size,
  className,
  path,
}: {
  size: number;
  className?: string;
  path: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

/**
 * The stores have no lucide glyphs — brand marks were removed from the set.
 * These are the stores' own marks, single-colour so they inherit the button's
 * text colour. Used only on store buttons and the Google sign-in button, never
 * as decorative icons.
 *
 * Google's guidelines allow the monochrome G on a dark button, which is what
 * the dashboard uses — the four-colour G would be a second brand palette on a
 * surface that is meant to carry one accent.
 */
const BRAND_MARKS = {
  google:
    "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
  google_play:
    "M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.001 1.001 0 010 1.73l-2.808 1.626L15.117 12l2.581-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z",
  app_store:
    "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
} as const;

/**
 * The design system loads Material Symbols Rounded, but flags it as a
 * substitution made only because no icon set was supplied. The project brief
 * specifies lucide-react, and a full Material Symbols variable font would blow
 * the web-font budget for a handful of glyphs — so we map the design's glyph
 * names onto their lucide equivalents here. One place to change if the app ever
 * ships its real icon set.
 */
const GLYPHS = {
  play_arrow: Play,
  download: Download,
  language: Globe,
  mic: Mic,
  bug_report: Bug,
  lightbulb: Lightbulb,
  balance: Scale,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof GLYPHS | keyof typeof BRAND_MARKS;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  if (name in BRAND_MARKS) {
    return (
      <BrandMark
        size={size}
        className={className}
        path={BRAND_MARKS[name as keyof typeof BRAND_MARKS]}
      />
    );
  }

  const Glyph = GLYPHS[name as keyof typeof GLYPHS];
  return (
    <Glyph
      size={size}
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      focusable="false"
    />
  );
}
