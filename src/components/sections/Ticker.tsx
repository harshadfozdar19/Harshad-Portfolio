import styles from "./Ticker.module.css";

/** Presentation-only list for the tape; the full inventory lives in profile.ts `skills`. */
const STACK = [
  "TypeScript",
  "NestJS",
  "Next.js",
  "React",
  "LangGraph",
  "Gemini",
  "BullMQ",
  "Redis",
  "PostgreSQL",
  "MongoDB",
  "Playwright",
  "FastAPI",
  "Pinecone",
  "Python",
  "Docker",
] as const;

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className={styles.run}
      aria-label={hidden ? undefined : "Core stack"}
      aria-hidden={hidden || undefined}
    >
      {STACK.map((item) => (
        <li key={item} className={styles.item}>
          {item}
          <span className={styles.sep} aria-hidden="true">
            ■
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Evidence-tape band of the core stack. Pure CSS marquee: the run is duplicated and the
 * track slides by exactly one run (-50%), so the loop is seamless. Pauses on hover,
 * stays still for reduced motion, and `content-visibility: auto` stops it offscreen.
 */
export function Ticker() {
  return (
    <div className={styles.wrap}>
      <div className={styles.ghost} aria-hidden="true" />
      <div className={styles.band}>
        <div className={styles.track}>
          <Run />
          <Run hidden />
        </div>
      </div>
    </div>
  );
}
