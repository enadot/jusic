import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * The dashboard's button, shadcn-shaped (cva variants, a `buttonVariants`
 * export for styling <Link>s) but wearing this brand: pills only, cyan fill
 * carries --text-on-cyan, and every colour is a themed variable so the same
 * class list works in both admin themes.
 */
export const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-1.5 rounded-full font-bold whitespace-nowrap",
    "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
    "cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        default: "bg-[var(--cyan-500)] text-[var(--text-on-cyan)] hover:bg-[var(--cyan-400)]",
        outline: cn(
          "border border-[var(--border)] bg-transparent text-[var(--text-primary)]",
          "hover:bg-[var(--ad-hover)]",
        ),
        ghost: "text-[var(--text-secondary)] hover:bg-[var(--ad-hover)] hover:text-[var(--text-primary)]",
        destructive:
          "border border-[var(--chip-spam-bd)] bg-[var(--chip-spam-bg)] text-[var(--chip-spam-fg)] hover:opacity-85",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-10 px-4 text-[14px]",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-9 w-9 p-0",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, block, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}
