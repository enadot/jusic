import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Shape rules from the design system:
 * always a pill, never a square button; a filled cyan button always carries
 * #0F1417 text (white on cyan is 2.6:1 and fails); hover moves to the next
 * lighter brand step, press scales to 0.96, focus is a ring and never a fill.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-500 text-text-on-cyan hover:bg-cyan-400 active:bg-cyan-600 shadow-[var(--shadow-glow-cyan)]",
  secondary:
    "bg-white text-ink-900 hover:bg-sage-50 active:bg-sage-100",
  outline:
    "border-[1.5px] border-sage-700 text-text-primary hover:border-sage-600 hover:bg-white/[0.06] active:bg-white/[0.1]",
  ghost:
    "text-text-primary hover:bg-white/[0.06] active:bg-white/[0.1]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-[52px] px-7 text-[16px] gap-2",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-bold whitespace-nowrap",
    "transition-[background-color,border-color,transform,color] duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
    "active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className,
  );
}

export function ButtonContent({
  icon,
  children,
  size = "md",
}: {
  icon?: IconName;
  children: ReactNode;
  size?: ButtonSize;
}) {
  return (
    <>
      {icon ? <Icon name={icon} size={size === "sm" ? 16 : 18} /> : null}
      <span>{children}</span>
    </>
  );
}

/** Non-navigating button. For links use CtaLink so the element stays an anchor. */
export function Button({
  variant,
  size = "md",
  block,
  icon,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: IconName;
}) {
  return (
    <button
      {...rest}
      className={buttonClass({ variant, size, block, className })}
    >
      <ButtonContent icon={icon} size={size}>
        {children}
      </ButtonContent>
    </button>
  );
}
