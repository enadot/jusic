import {
  Apple,
  Bug,
  Download,
  Globe,
  Lightbulb,
  Mic,
  Play,
  Scale,
  type LucideIcon,
} from "lucide-react";

/**
 * Android has no lucide glyph — brand marks were removed from the set. This is
 * the platform's own mark, used only on store buttons, not a decorative icon.
 */
function AndroidMark({ size, className }: { size: number; className?: string }) {
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
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 00-.66-.38l-1.87 3.23A11.4 11.4 0 0012 8.06c-1.78 0-3.44.38-4.91 1.09L5.22 5.92a.38.38 0 10-.66.38L6.4 9.48C3.3 11.16 1.18 14.3.75 18h22.5c-.43-3.7-2.55-6.84-5.65-8.52zM7 15.25a1.13 1.13 0 110-2.25 1.13 1.13 0 010 2.25zm10 0a1.13 1.13 0 110-2.25 1.13 1.13 0 010 2.25z" />
    </svg>
  );
}

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
  phone_iphone: Apple,
  download: Download,
  language: Globe,
  mic: Mic,
  bug_report: Bug,
  lightbulb: Lightbulb,
  balance: Scale,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof GLYPHS | "android";

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  if (name === "android") return <AndroidMark size={size} className={className} />;

  const Glyph = GLYPHS[name];
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
