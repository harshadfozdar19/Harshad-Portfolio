import { Fragment, type ReactNode } from "react";
import { profile, stats } from "@/content/profile";
import { Highlight, Redact } from "@/components/ui/Marks";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IdCard } from "./profile/IdCard";
import { StatCounter } from "./profile/StatCounter";
import { splitPhrases } from "@/lib/splitPhrases";
import styles from "./Profile.module.css";

interface Mark {
  /** Must appear verbatim in `profile.about`; phrases that don't are simply left unmarked. */
  phrase: string;
  kind: "highlight" | "redact";
  delay?: number;
}

/** Which phrases of the about copy get the highlighter or a redaction bar. Kept sparse on purpose. */
const marks: Mark[] = [
  { phrase: "security, data and AI", kind: "highlight" },
  { phrase: "brand impersonation", kind: "redact", delay: 0.25 },
  { phrase: "credential exposure", kind: "redact", delay: 0.55 },
  { phrase: "AI investigation agent", kind: "highlight", delay: 0.2 },
];

const phrases = marks.map((mark) => mark.phrase);

function markUp(text: string): ReactNode[] {
  return splitPhrases(text, phrases).map((segment, i) => {
    if (segment.match === null) return <Fragment key={i}>{segment.text}</Fragment>;
    const mark = marks[segment.match];
    return mark.kind === "highlight" ? (
      <Highlight key={i} delay={mark.delay}>
        {segment.text}
      </Highlight>
    ) : (
      <Redact key={i} delay={mark.delay}>
        {segment.text}
      </Redact>
    );
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Profile() {
  return (
    <section id="profile" className="section" aria-labelledby="profile-title">
      <div className="container">
        <SectionHeader
          index="01"
          label="Profile"
          meta="Subject dossier"
          titleId="profile-title"
          title={
            <>
              I build systems that <em>find what’s hidden</em>
            </>
          }
        />

        <div className={styles.layout}>
          <div className={styles.badge}>
            <Reveal className={styles.badgeReveal}>
              <IdCard />
            </Reveal>
          </div>

          <div className={styles.dossier}>
            <div className={styles.about}>
              {profile.about.map((paragraph, i) => (
                <Reveal as="p" key={paragraph} delay={i * 0.08} className={styles.paragraph}>
                  {markUp(paragraph)}
                </Reveal>
              ))}
            </div>

            <Reveal as="figure" className={styles.quote}>
              <blockquote className={styles.quoteBody}>
                <span className={styles.quoteMark} aria-hidden="true">
                  “
                </span>
                <p>{profile.quote}</p>
              </blockquote>
              <figcaption className={styles.quoteBy}>— {profile.name}</figcaption>
            </Reveal>

            <ul className={styles.stats}>
              {stats.map((stat, i) => (
                <Reveal as="li" key={stat.label} delay={(i % 2) * 0.08} className={styles.stat}>
                  <span className={styles.statIndex} aria-hidden="true">
                    S.{pad(i + 1)}
                  </span>
                  <span className={styles.statValue}>
                    <StatCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
