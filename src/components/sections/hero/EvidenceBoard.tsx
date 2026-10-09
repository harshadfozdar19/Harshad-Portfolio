"use client";

import { useInView } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { usePageVisible } from "./hooks";
import styles from "./EvidenceBoard.module.css";

/*
 * Illustrative link-analysis board. Sample data only (acme-corp is a placeholder),
 * so it lives with the illustration rather than in profile.ts.
 *
 * Geometry: the plot is a 100 × H box. The SVG strings use those units directly and
 * the HTML chips are placed by percentage, so labels stay real text at a legible
 * pixel size at every width while the strings scale with the board.
 */

const H = 90;

type NodeId = "target" | "repo" | "account" | "commit" | "domain" | "identity" | "verdict";

interface BoardNode {
  id: NodeId;
  kind: string;
  value: string;
  x: number;
  y: number;
  /** Which side of the chip the anchor sits on, so edge chips never leave the board. */
  align: "start" | "center" | "end";
  tone?: "suspect" | "verdict";
  /** Seconds after the board starts until the chip lands. */
  at: number;
}

interface BoardEdge {
  from: NodeId;
  to: NodeId;
  /** Seconds after the board starts until the string begins to draw. */
  at: number;
}

const NODES: BoardNode[] = [
  {
    id: "target",
    kind: "Target",
    value: "acme-corp",
    x: 50,
    y: 10,
    align: "center",
    tone: "suspect",
    at: 0.15,
  },
  { id: "repo", kind: "Repo", value: "acme/payments-api", x: 9, y: 28, align: "start", at: 0.95 },
  { id: "account", kind: "Account", value: "@acme_support", x: 91, y: 28, align: "end", at: 1.15 },
  { id: "commit", kind: "Commit", value: "3f9a1c", x: 9, y: 49, align: "start", at: 1.45 },
  { id: "domain", kind: "Domain", value: "acme-help.co", x: 91, y: 49, align: "end", at: 1.65 },
  { id: "identity", kind: "Identity", value: "j.doe", x: 50, y: 64, align: "center", at: 1.95 },
  { id: "verdict", kind: "Verdict", value: "High", x: 50, y: 80, align: "center", tone: "verdict", at: 2.55 },
];

const EDGES: BoardEdge[] = [
  { from: "target", to: "repo", at: 0.5 },
  { from: "target", to: "account", at: 0.7 },
  { from: "repo", to: "commit", at: 1.0 },
  { from: "account", to: "domain", at: 1.2 },
  { from: "commit", to: "identity", at: 1.5 },
  { from: "domain", to: "identity", at: 1.7 },
  { from: "identity", to: "verdict", at: 2.1 },
];

/** A weaker, inferred link: embedding similarity between the repo and the account. */
const CORRELATION = { from: "repo" as NodeId, to: "account" as NodeId, score: "sim 0.91", at: 2.9 };

const byId = new Map(NODES.map((node) => [node.id, node]));

function point(id: NodeId) {
  const node = byId.get(id);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

/** A slightly slack string: a quadratic curve that sags under its own weight. */
function stringPath(from: NodeId, to: NodeId): string {
  const a = point(from);
  const b = point(to);
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const sag = 1.5 + length * 0.06;
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 + sag;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x} ${b.y}`;
}

const PATHS = EDGES.map((edge) => stringPath(edge.from, edge.to));
const CORRELATION_PATH = `M ${point(CORRELATION.from).x} ${point(CORRELATION.from).y} L ${point(CORRELATION.to).x} ${point(CORRELATION.to).y}`;

function neighbours(id: NodeId): Set<NodeId> {
  const set = new Set<NodeId>([id]);
  for (const edge of EDGES) {
    if (edge.from === id) set.add(edge.to);
    if (edge.to === id) set.add(edge.from);
  }
  if (CORRELATION.from === id) set.add(CORRELATION.to);
  if (CORRELATION.to === id) set.add(CORRELATION.from);
  return set;
}

const DESCRIPTION =
  "Illustration of a link-analysis board with sample data: a target company, acme-corp, is connected by red string to a code repository and a look-alike support account, then to a commit and a look-alike domain, which both lead to one identity and a high-risk verdict.";

const vars = (values: Record<string, string | number>) => values as CSSProperties;

export function EvidenceBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const pageVisible = usePageVisible();
  const [active, setActive] = useState<NodeId | null>(null);

  const running = inView && pageVisible;
  const lit = active ? neighbours(active) : null;
  const edgeState = (from: NodeId, to: NodeId) =>
    active ? (from === active || to === active ? "on" : "off") : undefined;

  return (
    <div
      ref={ref}
      className={styles.board}
      data-run={running ? "" : undefined}
      data-active={active ?? undefined}
    >
      <div className={styles.head} aria-hidden="true">
        <span>Fig. 1 — Link analysis</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.plot} role="img" aria-label={DESCRIPTION}>
        <svg className={styles.strings} viewBox={`0 0 100 ${H}`} aria-hidden="true" focusable="false">
          <g className={styles.correlation} data-state={edgeState(CORRELATION.from, CORRELATION.to)}>
            <path d={CORRELATION_PATH} style={vars({ "--at": `${CORRELATION.at}s` })} />
          </g>
          {EDGES.map((edge, index) => (
            <g
              key={`${edge.from}-${edge.to}`}
              className={styles.edge}
              data-state={edgeState(edge.from, edge.to)}
            >
              <path
                className={styles.shadow}
                d={PATHS[index]}
                pathLength={1}
                transform="translate(0.35 0.8)"
                style={vars({ "--at": `${edge.at}s` })}
              />
              <path
                className={styles.string}
                d={PATHS[index]}
                pathLength={1}
                style={vars({ "--at": `${edge.at}s` })}
              />
            </g>
          ))}
        </svg>

        <span
          className={styles.score}
          data-state={edgeState(CORRELATION.from, CORRELATION.to)}
          style={vars({
            "--x": (point(CORRELATION.from).x + point(CORRELATION.to).x) / 2,
            "--y": (point(CORRELATION.from).y / H) * 100,
            "--at": `${CORRELATION.at + 0.2}s`,
          })}
          aria-hidden="true"
        >
          {CORRELATION.score}
        </span>

        {NODES.map((node, index) => (
          <div
            key={node.id}
            className={styles.node}
            data-align={node.align}
            data-tone={node.tone}
            data-state={lit ? (lit.has(node.id) ? "on" : "off") : undefined}
            data-focus={active === node.id ? "" : undefined}
            style={vars({
              "--x": node.x,
              "--y": (node.y / H) * 100,
              "--at": `${node.at}s`,
              "--sway-delay": `${-index * 1.7}s`,
            })}
            onPointerEnter={() => setActive(node.id)}
            onPointerLeave={() => setActive((current) => (current === node.id ? null : current))}
          >
            <div className={styles.land}>
              <div className={styles.chip}>
                {node.tone === "verdict" ? (
                  <span className={styles.value}>
                    {node.kind} · {node.value}
                  </span>
                ) : (
                  <>
                    <span className={styles.kind}>{node.kind}</span>
                    <span className={styles.value}>{node.value}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
