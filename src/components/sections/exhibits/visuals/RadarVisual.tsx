"use client";

import type { CSSProperties } from "react";
import { usePlayback } from "./usePlayback";
import s from "./Visuals.module.css";

type Point = readonly [x: number, y: number];

/* Radar on a 400 × 240 sheet. Bearings are degrees clockwise from 12 o'clock. */
const CX = 200;
const CY = 128;
const R = 100;
/** One full turn of the sweep, in seconds. Keep in sync with the radar cycle in Visuals.module.css. */
const TURN = 4.8;
const TRAIL_DEG = 48;

const fmt = (n: number) => n.toFixed(2);

function bearing(deg: number, r: number): Point {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
}

/** Seconds into a turn at which the sweep's leading edge crosses a bearing. */
const passAt = (deg: number) => `${((deg / 360) * TURN).toFixed(3)}s`;

const RINGS = [25, 50, 75, R];

const TICKS = Array.from({ length: 24 }, (_, i) => {
  const deg = i * 15;
  const [x0, y0] = bearing(deg, R);
  const [x1, y1] = bearing(deg, i % 6 === 0 ? R + 8 : R + 4);
  return `M${fmt(x0)} ${fmt(y0)} L${fmt(x1)} ${fmt(y1)}`;
}).join(" ");

/** Wedge: leading edge at 12 o'clock, trailing edge TRAIL_DEG behind it. */
const WEDGE = (() => {
  const [tx, ty] = bearing(-TRAIL_DEG, R);
  return `M${CX} ${CY} L${CX} ${CY - R} A${R} ${R} 0 0 0 ${fmt(tx)} ${fmt(ty)} Z`;
})();

const BLIPS = [
  { deg: 38, r: 68 },
  { deg: 128, r: 86 },
  { deg: 204, r: 46 },
  { deg: 292, r: 76 },
].map(({ deg, r }) => ({ deg, point: bearing(deg, r) }));

const FLAG_DEG = 62;
const [FLAG_X, FLAG_Y] = bearing(FLAG_DEG, 84);

/* Label card, top right, joined to the flagged blip by a leader line. */
const TAG = { x: 249, y: 38, width: 143, height: 20 };

/** Exhibit C: a radar sweep over discovered accounts, with one flagged for investigation. */
export function RadarVisual() {
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
      <circle className={s.radarLive} cx="19" cy="24.5" r="3" />
      <text className={s.label} x="28" y="28">
        MONITORING
      </text>

      {/* Scope: rings, crosshair and bearing ticks */}
      {RINGS.map((r) => (
        <circle key={r} className={s.faint} cx={CX} cy={CY} r={r} />
      ))}
      <path
        className={s.faint}
        d={`M${CX - R - 12} ${CY} H${CX + R + 12} M${CX} ${CY - R - 12} V${CY + R + 12}`}
      />
      <path className={s.hair} d={TICKS} />

      {/* Sweep: the invisible circle gives the group a bounding box centred on the scope */}
      <g className={s.radarSweep}>
        <circle cx={CX} cy={CY} r={R} fill="none" />
        <path className={s.radarWedge} d={WEDGE} />
        <path className={s.radarEdge} d={`M${CX} ${CY} V${CY - R}`} />
      </g>

      {/* Contacts */}
      {BLIPS.map(({ deg, point: [x, y] }) => (
        <circle
          key={deg}
          className={s.radarBlip}
          cx={fmt(x)}
          cy={fmt(y)}
          r="3"
          style={{ "--d": passAt(deg) } as CSSProperties}
        />
      ))}

      {/* The flagged account */}
      <path className={s.radarLeader} d={`M${fmt(FLAG_X)} ${fmt(FLAG_Y - 6)} V${TAG.y + TAG.height}`} />
      <circle className={s.radarPing} cx={fmt(FLAG_X)} cy={fmt(FLAG_Y)} r="4" />
      <circle
        className={s.radarFlag}
        cx={fmt(FLAG_X)}
        cy={fmt(FLAG_Y)}
        r="4"
        style={{ "--d": passAt(FLAG_DEG) } as CSSProperties}
      />
      <rect className={s.radarTag} x={TAG.x} y={TAG.y} width={TAG.width} height={TAG.height} rx="2" />
      <text className={s.radarTagText} x={TAG.x + 8} y={TAG.y + 13.5}>
        @acme_support <tspan className={s.radarTagFlag}>· flagged</tspan>
      </text>
    </svg>
  );
}
