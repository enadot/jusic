"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/analytics";

/** Stores campaign params once per session so every later event carries them. */
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
