"use client";

import { useEffect, useState } from "react";

/**
 * Fetches the signed render-time marker used by the spam checks. Called once
 * per mounted form — for modals that means once per open, which is also when
 * the clock the server checks against should start.
 */
export function useFormToken(): string | null {
  const [stamp, setStamp] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/form-token", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stamp?: string } | null) => {
        if (data?.stamp) setStamp(data.stamp);
      })
      .catch(() => {
        /* Offline or blocked: submit stays disabled and the user sees why. */
      });

    return () => controller.abort();
  }, []);

  return stamp;
}
