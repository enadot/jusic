"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * shadcn Select on Radix, RTL-safe: only logical properties, the check
 * indicator on the end side, and Radix's own dir taken from the document.
 * With a `name` prop Radix renders a hidden native <select>, so this drops
 * into the dashboard's plain-GET filter forms unchanged.
 */
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--border)]",
        "bg-[var(--surface-input)] px-3 text-[14px] text-[var(--text-primary)]",
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
        "cursor-pointer hover:border-[var(--text-disabled)] disabled:cursor-default disabled:opacity-50",
        "data-[placeholder]:text-[var(--text-tertiary)]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="shrink-0 text-[var(--text-tertiary)]"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        className={cn(
          "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[var(--radius-sm)]",
          "border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-raised)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-xs)] px-2.5 py-2 text-[14px]",
        "text-[var(--text-primary)] outline-none select-none",
        "data-[highlighted]:bg-[var(--ad-hover-strong)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check size={15} aria-hidden="true" className="text-[var(--cyan-400)]" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
