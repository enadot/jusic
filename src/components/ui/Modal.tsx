"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A native <dialog> opened with showModal(). Chosen over a hand-rolled overlay
 * because the platform already gives us the hard parts: focus is trapped inside,
 * Esc closes, the rest of the page goes inert, and the dialog renders in the top
 * layer so it cannot be trapped under the sticky header.
 *
 * Presentation follows the two shapes users expect: a bottom sheet on phones,
 * a centred card from 640px up.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  closeLabel = "סגירה",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeLabel?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // showModal()/close() are imperative DOM calls, so this effect is
    // synchronising React state to an external system — its intended use.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dlg"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Fires for Esc and for form method="dialog" alike, so state stays in sync
      // however the dialog was dismissed.
      onClose={onClose}
      // A click that lands on the dialog element itself is a backdrop click:
      // the panel below stops propagation of its own clicks.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "relative flex max-h-[88svh] w-full flex-col overflow-hidden",
          "bg-[var(--surface-card)] shadow-[var(--shadow-raised)]",
          "border border-[var(--border-subtle)]",
          "rounded-t-[28px] sm:mx-auto sm:w-[520px] sm:max-w-[calc(100vw-32px)] sm:rounded-[20px]",
        )}
      >
        <header className="flex items-start gap-3 px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
          {/* Grab handle: sheet affordance on phones, meaningless on desktop. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-2 mx-auto h-1 w-9 rounded-full bg-white/20 sm:hidden"
          />
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="m-0 text-[20px] font-extrabold tracking-[-0.01em] sm:text-[22px]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1.5 mb-0 text-[14px] leading-[1.55] text-text-secondary"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={cn(
              "-me-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              "text-text-secondary hover:bg-white/[0.08] hover:text-text-primary",
              "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
            )}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          {children}
        </div>
      </div>
    </dialog>
  );
}
