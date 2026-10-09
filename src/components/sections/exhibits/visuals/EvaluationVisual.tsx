"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, type CSSProperties } from "react";
import { usePlayback } from "./usePlayback";
import s from "./Visuals.module.css";

type Point = readonly [x: number, y: number];

/* Illustrative sample data, labelled as such on the drawing. */
const SCORE = 8.6;
const HISTORY = [4.2, 5.4, 6.3, 7.5, SCORE];

/* Dial: a 240° arc with its opening at the bottom, on a 400 × 240 sheet. */
const CX = 110;
const CY = 128;
const R = 72;
const START_DEG = 150;
const SWEEP_DEG = 240;

const fmt = (n: number) => n.toFixed(2);

function polar(deg: number, r: number): Point {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

const angleFor = (fraction: number) => START_DEG + SWEEP_DEG * fraction;

const DIAL = (() => {
  const [x0, y0] = polar(START_DEG, R);
  const [x1, y1] = polar(START_DEG + SWEEP_DEG, R);
  return `M${fmt(x0)} ${fmt(y0)} A${R} ${R} 0 1 1 ${fmt(x1)} ${fmt(y1)}`;
})();

const TICKS = Array.from({ length: 11 }, (_, i) => {
  const deg = angleFor(i / 10);
  const [x0, y0] = polar(deg, 80);
  const [x1, y1] = polar(deg, i % 5 === 0 ? 88 : 84);
  return `M${fmt(x0)} ${fmt(y0)} L${fmt(x1)} ${fmt(y1)}`;
}).join(" ");

const [MARKER_X, MARKER_Y] = polar(angleFor(SCORE / 10), R);
const [MIN_X, MIN_Y] = polar(START_DEG, 100);
const [MAX_X, MAX_Y] = polar(START_DEG + SWEEP_DEG, 100);

/* Progress chart: five attempts on a 0–10 scale. */
const BASE_Y = 184;
const UNIT = 11;
const BAR_W = 16;
const barX = (k: number) => 252 + k * 30;
const barTop = (v: number) => BASE_Y - v * UNIT;
const GRID = [2.5, 5, 7.5, 10].map((v) => `M234 ${barTop(v)} H384`).join(" ");
const TREND = HISTORY.map((v, k) => `${k === 0 ? "M" : "L"}${barX(k)} ${fmt(barTop(v))}`).join(" ");
const LATEST = HISTORY.length - 1;

/** Exhibit B: a score dial that draws to 8.6/10 and a progress chart of attempts (sample data). */
export function EvaluationVisual() {
  const { ref, playing, started, reduced } = usePlayback<SVGSVGElement>();
  const score = useMotionValue(SCORE);
  const scoreText = useTransform(score, (v) => v.toFixed(1));

  // Count up from zero the first time the dial is seen. Reduced motion keeps the final score.
  useEffect(() => {
    if (!started || reduced) return;
    score.set(0);
    const controls = animate(score, SCORE, { duration: 1.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [started, reduced, score]);

  return (
    <svg
      ref={ref}
      className={s.svg}
      viewBox="0 0 400 240"
      data-playing={playing}
      data-started={started}
      aria-hidden="true"
      focusable="false"
    >
      <text className={s.label} x="16" y="28">
        AI EVALUATION
      </text>
      <text className={s.label} x="384" y="28" textAnchor="end">
        SAMPLE DATA
      </text>

      {/* Dial */}
      <path className={s.hair} d={TICKS} />
      <path className={s.evTrack} d={DIAL} />
      <path className={s.evArc} d={DIAL} pathLength={1} />
      <circle className={s.evMarker} cx={fmt(MARKER_X)} cy={fmt(MARKER_Y)} r="4.5" />
      <text className={s.label} x={fmt(MIN_X)} y={fmt(MIN_Y + 4)} textAnchor="middle">
        0
      </text>
      <text className={s.label} x={fmt(MAX_X)} y={fmt(MAX_Y + 4)} textAnchor="middle">
        10
      </text>
      <text className={`${s.evScore} ${s.evReadout}`} x={CX} y="136" textAnchor="middle">
        <motion.tspan>{scoreText}</motion.tspan>
        <tspan className={s.evOutOf} dx="3">
          /10
        </tspan>
      </text>
      <text className={s.label} x={CX} y="160" textAnchor="middle">
        SCORE
      </text>

      {/* Progress chart */}
      <text className={s.label} x="234" y="60">
        PROGRESS
      </text>
      <path className={`${s.faint} ${s.dashed}`} d={GRID} />
      {HISTORY.map((v, k) => (
        <rect
          key={k}
          className={`${s.evBar} ${k === LATEST ? s.evBarLatest : ""}`}
          x={barX(k) - BAR_W / 2}
          y={fmt(barTop(v))}
          width={BAR_W}
          height={fmt(v * UNIT)}
          style={{ "--k": k } as CSSProperties}
        />
      ))}
      <path className={s.hair} d={`M234 ${BASE_Y} H384`} />
      <path className={s.evTrend} d={TREND} pathLength={1} />
      {HISTORY.map((v, k) => (
        <circle
          key={k}
          className={s.evDot}
          cx={barX(k)}
          cy={fmt(barTop(v))}
          r="2.5"
          style={{ "--k": k } as CSSProperties}
        />
      ))}
      <circle className={s.evPing} cx={barX(LATEST)} cy={fmt(barTop(SCORE))} r="5" />
      {HISTORY.map((_, k) => (
        <text key={k} className={s.label} x={barX(k)} y="200" textAnchor="middle">
          {String(k + 1).padStart(2, "0")}
        </text>
      ))}
    </svg>
  );
}
