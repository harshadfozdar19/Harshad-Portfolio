import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import styles from "./primitives.module.css";

interface SectionHeaderProps {
  /** Two-digit section number, e.g. "02". */
  index: string;
  /** Short mono label, e.g. "Record". */
  label: string;
  /** Right-aligned mono metadata, e.g. "3 entries". */
  meta?: string;
  /** Serif title; wrap a word in <em> for the italic vermilion accent. */
  title: ReactNode;
  intro?: ReactNode;
  /** id applied to the heading, for aria-labelledby on the section. */
  titleId: string;
}

export function SectionHeader({ index, label, meta, title, intro, titleId }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <Reveal className={`${styles.rule} label`}>
        <span className={styles.index}>
          <b>§ {index}</b>
          <span>{label}</span>
        </span>
        {meta ? <span>{meta}</span> : null}
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.1}>
          <p className={styles.intro}>{intro}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
