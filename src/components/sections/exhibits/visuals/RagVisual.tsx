"use client";

import type { CSSProperties } from "react";
import { usePlayback } from "./usePlayback";
import s from "./Visuals.module.css";

type Point = readonly [x: number, y: number];

/* Layout on a 400 × 240 sheet; every stage sits on the centre line y = 124. */
const CHUNK_YS = [95, 111, 127, 143];
const QUERY: Point = [254, 124];
/** The three nearest neighbours of the query: these are "retrieved". */
const RETRIEVED: Point[] = [
  [250, 110],
  [258, 140],
  [272, 116],
];
const VECTORS: Point[] = [
  [228, 102],
  [240, 90],
  [236, 134],
  [226, 152],
  [262, 98],
  [246, 156],
  [280, 144],
  [284, 98],
  [268, 158],
  [232, 118],
  [276, 130],
];
const TYPED_LINES = [38, 34, 20];
const STAGES = [
  { x: 56, label: "SOURCE" },
  { x: 154, label: "CHUNKS" },
  { x: 254, label: "VECTORS" },
  { x: 354, label: "ANSWER" },
];

/** Exhibit A: document → chunks → vectors → answer, with a pulse carrying a query through the chain. */
export function RagVisual() {
  const { ref, playing } = usePlayback<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      className={s.svg}
      viewBox="0 0 400 240"
      data-playing={playing}
      aria-hidden="true"
      focusable="false"
    >
      <text className={s.label} x="16" y="28">
        RAG PIPELINE
      </text>
      <text className={s.label} x="384" y="28" textAnchor="end">
        HYBRID SEARCH
      </text>

      {/* Connectors */}
      <path className={`${s.faint} ${s.dashed}`} d="M92 124 H122 M186 124 H214 M296 124 H320" />

      {/* The pulse travels under the stages, so it is "taken in" by each one. */}
      <circle className={s.ragPulse} cx="56" cy="124" r="4.5" />

      {/* Source document */}
      <path className={`${s.hair} ${s.paper} ${s.ragDoc}`} d="M28 88 H70 L84 102 V160 H28 Z" />
      <path className={s.hair} d="M70 88 V102 H84" />
      <path className={s.ragDocLine} d="M36 112 H76 M36 122 H70 M36 132 H76 M36 142 H62" />

      {/* Chunks */}
      {CHUNK_YS.map((y, k) => (
        <rect
          key={y}
          className={`${s.hair} ${s.ragChunk}`}
          x="130"
          y={y}
          width="48"
          height="10"
          rx="1.5"
          style={{ "--k": k } as CSSProperties}
        />
      ))}

      {/* Embedding space: retrieval links, neighbours and the query */}
      {RETRIEVED.map(([x, y]) => (
        <path
          key={`link-${x}`}
          className={s.ragLink}
          d={`M${QUERY[0]} ${QUERY[1]} L${x} ${y}`}
          pathLength={1}
        />
      ))}
      {VECTORS.map(([x, y]) => (
        <circle key={`${x}-${y}`} className={s.ragDot} cx={x} cy={y} r="2.4" />
      ))}
      {RETRIEVED.map(([x, y]) => (
        <circle key={`hit-${x}`} className={s.ragHit} cx={x} cy={y} r="2.8" />
      ))}
      <circle className={s.ragRing} cx={QUERY[0]} cy={QUERY[1]} r="9" />
      <circle className={s.ragQuery} cx={QUERY[0]} cy={QUERY[1]} r="3.5" />

      {/* Generated answer */}
      <path
        className={`${s.hair} ${s.paper} ${s.ragBubble}`}
        d="M330 98 H378 Q382 98 382 102 V140 Q382 144 378 144 H346 L334 156 L336 144 H330 Q326 144 326 140 V102 Q326 98 330 98 Z"
      />
      {TYPED_LINES.map((width, k) => (
        <rect
          key={width}
          className={s.ragType}
          x="334"
          y={110 + k * 10}
          width={width}
          height="3"
          rx="1.5"
          style={{ "--k": k } as CSSProperties}
        />
      ))}

      {STAGES.map((stage) => (
        <text key={stage.label} className={s.label} x={stage.x} y="192" textAnchor="middle">
          {stage.label}
        </text>
      ))}
    </svg>
  );
}
