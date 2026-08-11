import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 1160px content column with the design system's 32px / 16px gutters. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-desktop)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
