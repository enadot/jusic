"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { features } from "@/content/site";

const DEMO = features.demo;

/**
 * The Jusic Game band's illustration: one real, playable trivia round. The
 * question, the photo and the names came from the client (see `features.demo`
 * in src/content/site.ts) — nothing here is invented.
 *
 * A right answer fills the option and pops "כל הכבוד"; a wrong one shakes and
 * blushes the option that was pressed, and only that option — the round can be
 * tried again until it is solved, because a demo that locks you out after a
 * guess teaches the wrong thing about a game. Once solved it stays solved.
 *
 * Sighted feedback is motion and colour; non-sighted feedback is a polite live
 * region saying the same thing. Under prefers-reduced-motion the global kill
 * switch collapses the shake and the pop, and colour and text still answer.
 */
export function TriviaGame() {
  const [solved, setSolved] = useState(false);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  /**
   * The shake is its own flag, cleared by `animationend`, so hitting the same
   * wrong option again restarts it. Never remount the <li> for this: GSAP has
   * already played these items' entrance, and a remounted item would land back
   * on its pre-entrance from-state — invisible.
   */
  const [shaking, setShaking] = useState(false);

  const pick = (index: number) => {
    if (solved) return;
    if (index === DEMO.correct) {
      setSolved(true);
      setWrongPick(null);
    } else {
      setWrongPick(index);
      setShaking(true);
    }
  };

  return (
    <div
      data-anim-demo="game"
      className="mx-auto max-w-[400px] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-card)]"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <Icon name="gamepad" size={22} className="text-cyan-500" />
        <b>{DEMO.label}</b>
      </div>

      {/* The ring reuses the stories rings' geometry, so the two reads as one
          system. aria-hidden: naming the singer in the alt would answer the
          question for a screen reader before it was asked. */}
      <div className="mb-4 flex justify-center">
        <div
          aria-hidden="true"
          className={cn(
            "rounded-full p-[3px] transition-colors duration-[var(--dur-base)]",
            solved ? "bg-cyan-500" : "bg-[var(--ink-500)]",
          )}
        >
          <Image
            src={DEMO.photo}
            alt=""
            width={132}
            height={132}
            sizes="132px"
            className="block h-33 w-33 rounded-full border-[3px] border-[var(--bg)] object-cover"
          />
        </div>
      </div>

      <p className="mt-0 mb-3.5 text-center text-[var(--text-body-lg)] font-bold">
        {DEMO.question}
      </p>

      <ul data-anim-group="game-options" className="m-0 flex list-none flex-col gap-2 p-0">
        {DEMO.options.map((option, i) => {
          const isRight = solved && i === DEMO.correct;
          const isWrong = wrongPick === i;
          return (
            <li
              key={option}
              className={isWrong && shaking ? "quiz-shake" : undefined}
              onAnimationEnd={() => setShaking(false)}
            >
              <button
                type="button"
                onClick={() => pick(i)}
                disabled={solved && i !== DEMO.correct}
                className={cn(
                  "w-full rounded-full border px-4 py-3 text-start font-semibold",
                  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                  isRight
                    ? "border-cyan-500 bg-cyan-500 text-text-on-cyan"
                    : isWrong
                      ? "border-[var(--color-error)] bg-[var(--color-error)]/[0.12] text-text-primary"
                      : cn(
                          "border-transparent bg-[var(--surface-input)] text-text-secondary",
                          !solved &&
                            "cursor-pointer hover:border-cyan-700 hover:text-text-primary",
                          solved && "opacity-50",
                        ),
                )}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {/* One live region for both outcomes, so the announcement order is the
          user's own order of events. */}
      <p aria-live="polite" className="m-0 mt-3.5 min-h-[24px] text-center">
        {solved ? (
          <span className="quiz-pop inline-block font-extrabold text-cyan-400">
            {DEMO.right} 🎉
          </span>
        ) : wrongPick !== null ? (
          <span className="sr-only">{DEMO.wrong}</span>
        ) : null}
      </p>
    </div>
  );
}
