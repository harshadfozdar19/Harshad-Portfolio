"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePageVisible, usePrefersReducedMotion } from "./hooks";
import styles from "./InvestigationLog.module.css";

/*
 * A teleprinter replaying an illustrative run of the investigation agent.
 * Sample data: the pipeline steps mirror the real system, the target does not exist.
 */

type Tone = "prompt" | "dim" | "signal" | "mark" | "ok";

interface Segment {
  text: string;
  tone?: Tone;
}

const LINES: Segment[][] = [
  [
    { text: "$", tone: "prompt" },
    { text: " agent investigate --target " },
    { text: "acme-corp", tone: "signal" },
  ],
  [{ text: "› ", tone: "dim" }, { text: "scheduler: 3 new targets detected" }],
  [{ text: "› ", tone: "dim" }, { text: "queue bullmq:enrich " }, { text: "priority=HIGH", tone: "mark" }],
  [{ text: "› ", tone: "dim" }, { text: "worker#2 playwright → 14 accounts extracted" }],
  [{ text: "› ", tone: "dim" }, { text: "dedupe + enrich → repos, commits, identities" }],
  [{ text: "› ", tone: "dim" }, { text: "semantic search: 6 correlated signals" }],
  [{ text: "› ", tone: "dim" }, { text: "langgraph tools: github · search · embeddings" }],
  [{ text: "› ", tone: "dim" }, { text: "gemini reasoning over evidence…" }],
  [
    { text: "✔", tone: "ok" },
    { text: " verdict { risk: " },
    { text: '"high"', tone: "signal" },
    { text: ', type: "impersonation" }' },
  ],
];

const SUMMARY =
  "Illustrative agent log: a scheduler finds new targets, BullMQ queues them by priority, Playwright workers extract accounts, enrichment and semantic search correlate the signals, and a LangGraph agent with Gemini returns a structured high-risk impersonation verdict.";

const LENGTHS = LINES.map((line) => line.reduce((sum, segment) => sum + segment.text.length, 0));
const STARTS = LENGTHS.map((_, index) => LENGTHS.slice(0, index).reduce((sum, length) => sum + length, 0));
const ENDS = STARTS.map((start, index) => start + LENGTHS[index]);
const TOTAL = ENDS[ENDS.length - 1];

/** The line the caret is on: the last line that has started (a finished line keeps the caret). */
function lineAt(step: number): number {
  for (let index = LINES.length - 1; index >= 0; index--) {
    if (step > STARTS[index]) return index;
  }
  return 0;
}

/** How long to wait at `step` before advancing, in ms. */
function delayAt(step: number): number {
  if (step === 0) return 900; // fresh prompt
  if (step >= TOTAL) return 4200; // hold the verdict, then start over
  const finished = ENDS.indexOf(step);
  if (finished === 0) return 650; // "enter" on the command
  if (finished === LINES.length - 2) return 1100; // the model thinks
  if (finished > 0) return 240;
  // The command is typed by hand (uneven rhythm); output prints fast.
  return lineAt(step) === 0 ? 46 + ((step * 7) % 5) * 12 : 14;
}

function advance(step: number): number {
  if (step >= TOTAL) return 0;
  const line = lineAt(step);
  if (line === 0 || ENDS.includes(step)) return step + 1;
  return Math.min(step + 2, ENDS[line]);
}

function renderLine(segments: Segment[], visible: number): ReactNode[] {
  const out: ReactNode[] = [];
  let remaining = visible;
  segments.forEach((segment, index) => {
    if (remaining <= 0) return;
    const text = segment.text.slice(0, remaining);
    remaining -= text.length;
    out.push(
      segment.tone ? (
        <span key={index} className={styles[segment.tone]}>
          {text}
        </span>
      ) : (
        text
      ),
    );
  });
  return out;
}

export function InvestigationLog({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  const running = inView && pageVisible && !reducedMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep(advance), delayAt(step));
    return () => window.clearTimeout(timer);
  }, [running, step]);

  // Reduced motion: the whole run, printed and still.
  const shown = reducedMotion ? TOTAL : step;
  const done = shown >= TOTAL;
  const current = lineAt(shown);
  const typing = running && !done && shown > 0 && !ENDS.includes(shown);

  const caret = <span className={styles.caret} data-typing={typing ? "" : undefined} />;

  return (
    <div ref={ref} className={`${styles.log} ${className ?? ""}`} data-run={running ? "" : undefined}>
      <div className={styles.panel} aria-hidden="true">
        <div className={styles.head}>
          <span>TTY/02 · agent.log</span>
          <span className={styles.status}>
            <span className={styles.dot} />
            {done ? "Verdict" : "Live"}
          </span>
        </div>
        <div className={styles.screen}>
          <div className={styles.lines}>
            {LINES.slice(0, current + 1).map((segments, index) => {
              const visible = Math.max(0, Math.min(shown - STARTS[index], LENGTHS[index]));
              return (
                <p key={index} className={styles.line}>
                  {renderLine(segments, visible)}
                  {index === current ? caret : null}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <p className="visually-hidden">{SUMMARY}</p>
    </div>
  );
}
