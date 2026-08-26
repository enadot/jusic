"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { stories } from "@/content/site";

const ITEMS = stories.items;
const UI = stories.ui;

/**
 * The stories band illustration, and the viewer behind it.
 *
 * This is the one client component in the feature bands, and it is written
 * against the platform rather than a stories library: a package like
 * react-instagram-stories would land in the home page's initial JS, which is
 * the one budget on this site with no slack in it, and everything it provides
 * — segmented progress, tap-through, auto-advance — is a `<video>` element and
 * about eighty lines. The clips themselves cost nothing until a ring is
 * clicked: `preload="none"` on the single mounted <video>, and the poster the
 * ring already shows is the poster the player opens on.
 */
export function StoriesStrip() {
  const [index, setIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);

  /** Past the last story the run is over, which is what a viewer expects. */
  const step = useCallback((delta: number) => {
    setIndex((current) => {
      if (current === null) return null;
      const next = current + delta;
      if (next < 0) return 0;
      return next >= ITEMS.length ? null : next;
    });
  }, []);

  // showModal()/close() are imperative DOM calls, so this effect synchronises
  // React state to an external system — the same pattern as ui/Modal.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // A new story: rewind, clear the bar, and play. The click that opened the
  // viewer is the user gesture that lets this play with sound; when a browser
  // refuses anyway, fall back to muted rather than to a stalled frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || index === null) return;
    setProgress(0);
    setPaused(false);
    video.currentTime = 0;
    void video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      void video.play().catch(() => setPaused(true));
    });
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      // RTL: the story after this one sits to the left of it, so ArrowLeft
      // advances and ArrowRight goes back — the arrows follow the eye, not
      // the array.
      if (event.key === "ArrowLeft") step(1);
      else if (event.key === "ArrowRight") step(-1);
      else if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || index === null) return;
    if (paused) video.pause();
    else void video.play().catch(() => undefined);
  }, [paused, index]);

  const current = index === null ? null : ITEMS[index];

  return (
    <>
      <div data-anim-demo="story" className="flex flex-wrap justify-center gap-3">
        {ITEMS.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`${UI.open} ${i + 1} מתוך ${ITEMS.length}`}
            onClick={() => {
              setIndex(i);
              track("story_open", { placement: "stories", story: i + 1 });
            }}
            className={cn(
              "rounded-full p-[3px] transition-transform duration-[var(--dur-fast)]",
              "ease-[var(--ease-standard)] hover:scale-[1.04] motion-reduce:transition-none",
              "motion-reduce:hover:scale-100",
              i < 3 ? "bg-cyan-500" : "bg-[var(--ink-500)]",
            )}
          >
            <Image
              src={item.poster}
              alt=""
              width={84}
              height={84}
              sizes="84px"
              className="block h-21 w-21 rounded-full border-[3px] border-[var(--bg)] object-cover"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="story-dlg"
        aria-label={UI.dialog}
        onClose={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="relative mx-auto flex h-full w-full items-center justify-center p-0 sm:p-4"
        >
          {current ? (
            /* 9:16, and never taller than the viewport: the clips are all
               478x850 or 576x1024, so the box is sized off the height as soon
               as the width would push it past the fold. */
            <div className="relative aspect-[9/16] w-full max-w-[min(430px,calc((100svh-32px)*9/16))] overflow-hidden bg-black sm:rounded-[20px]">
              <video
                ref={videoRef}
                key={current.src}
                src={current.src}
                poster={current.poster}
                preload="none"
                playsInline
                muted={muted}
                onEnded={() => step(1)}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;
                  if (video.duration > 0) {
                    setProgress(video.currentTime / video.duration);
                  }
                }}
                className="block h-full w-full object-cover"
              />

              {/* Tap-through. The start half is the previous story, which in
                  RTL puts "back" under the thumb that reads first. */}
              <button
                type="button"
                aria-label={UI.prev}
                onClick={() => step(-1)}
                className="absolute inset-y-0 start-0 w-1/3 cursor-default"
              />
              <button
                type="button"
                aria-label={UI.next}
                onClick={() => step(1)}
                className="absolute inset-y-0 end-0 w-1/3 cursor-default"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(8,11,13,0.72),transparent)]" />

              {/* One segment per story: filled behind, live on this one. */}
              <div className="absolute inset-x-0 top-0 flex gap-1 p-3">
                {ITEMS.map((item, i) => (
                  <span
                    key={item.src}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    <span
                      className="block h-full rounded-full bg-white"
                      style={{
                        width:
                          index !== null && i < index
                            ? "100%"
                            : i === index
                              ? `${progress * 100}%`
                              : "0%",
                      }}
                    />
                  </span>
                ))}
              </div>

              <div className="absolute top-6 end-3 flex items-center gap-1">
                <ViewerButton
                  label={paused ? UI.play : UI.pause}
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? (
                    <Play size={18} aria-hidden="true" />
                  ) : (
                    <Pause size={18} aria-hidden="true" />
                  )}
                </ViewerButton>
                <ViewerButton
                  label={muted ? UI.unmute : UI.mute}
                  onClick={() => setMuted((value) => !value)}
                >
                  {muted ? (
                    <VolumeX size={18} aria-hidden="true" />
                  ) : (
                    <Volume2 size={18} aria-hidden="true" />
                  )}
                </ViewerButton>
                <ViewerButton label={UI.close} onClick={close}>
                  <X size={18} aria-hidden="true" />
                </ViewerButton>
              </div>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}

function ViewerButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-white",
        "bg-black/45 hover:bg-black/65",
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
      )}
    >
      {children}
    </button>
  );
}
