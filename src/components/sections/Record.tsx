import { Fragment } from "react";
import { experience } from "@/content/profile";
import type { Experience, Pillar } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { splitPhrases } from "@/lib/splitPhrases";
import { Timeline } from "./record/Timeline";
import styles from "./Record.module.css";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Aug 2026" → "2026-08" for <time dateTime>; anything else (e.g. "Present") → undefined. */
function toDateTime(label: string): string | undefined {
  const match = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i.exec(label.trim());
  if (!match) return undefined;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  return month === -1 ? undefined : `${match[2]}-${String(month + 1).padStart(2, "0")}`;
}

function DateLabel({ label }: { label: string }) {
  const dateTime = toDateTime(label);
  return dateTime ? <time dateTime={dateTime}>{label}</time> : <span>{label}</span>;
}

/** Wraps the content's own emphasis phrases in <strong>, without forking the copy. */
function Emphasised({ text, phrases }: { text: string; phrases?: string[] }) {
  if (!phrases?.length) return <>{text}</>;
  return (
    <>
      {splitPhrases(text, phrases).map((segment, i) =>
        segment.match === null ? (
          <Fragment key={i}>{segment.text}</Fragment>
        ) : (
          <strong key={i}>{segment.text}</strong>
        ),
      )}
    </>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.code}>{pillar.code}</span>
        <span className={styles.punch} aria-hidden="true" />
      </div>
      <h4 className={styles.pillarTitle}>{pillar.title}</h4>
      <p className={styles.pillarBody}>
        <Emphasised text={pillar.body} phrases={pillar.emphasis} />
      </p>
    </div>
  );
}

function Entry({ job, index }: { job: Experience; index: number }) {
  const expanded = Boolean(job.pillars?.length);

  return (
    <li className={`${styles.entry} ${expanded ? styles.expanded : styles.compact}`}>
      <span className={`${styles.marker} ${job.current ? styles.markerCurrent : ""}`} aria-hidden="true" />

      <Reveal className={styles.when}>
        <span className={styles.entryNo} aria-hidden="true">
          Entry {pad(index + 1)}
        </span>
        <p className={styles.dates}>
          <DateLabel label={job.start} /> <span aria-hidden="true">—</span>
          <span className="visually-hidden">to</span> <DateLabel label={job.end} />
        </p>
        {job.current ? (
          <span className={styles.current}>
            <span className={styles.pulse} aria-hidden="true" />
            Current
          </span>
        ) : null}
      </Reveal>

      <div className={styles.what}>
        <Reveal delay={0.05}>
          <div className={styles.titleRow}>
            <h3 className={styles.company}>{job.company}</h3>
            {job.note ? <span className={styles.note}>{job.note}</span> : null}
          </div>
          <p className={styles.role}>
            <span className={styles.roleName}>{job.role}</span>
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
            <span className="visually-hidden">, </span>
            <span>{job.location}</span>
          </p>
          <p className={styles.summary}>{job.summary}</p>
        </Reveal>

        {job.productAreas?.length ? (
          <Reveal delay={0.1} className={styles.group}>
            <p className="label">Product areas</p>
            <ul className={styles.tags}>
              {job.productAreas.map((area) => (
                <li key={area}>
                  <Tag tone="signal">{area}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {job.pillars?.length ? (
          <div className={styles.group}>
            <p className="label">Workstreams</p>
            <ul className={styles.pillars}>
              {job.pillars.map((pillar, i) => (
                <Reveal as="li" key={pillar.code} delay={(i % 3) * 0.08} className={styles.pillarItem}>
                  <PillarCard pillar={pillar} />
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}

        <Reveal delay={expanded ? 0 : 0.1} className={styles.group}>
          {expanded ? <p className="label">Stack</p> : null}
          <ul className={styles.tags}>
            {job.skills.map((skill) => (
              <li key={skill}>
                <Tag>{skill}</Tag>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </li>
  );
}

export function Record() {
  return (
    <section id="record" className="section" aria-labelledby="record-title">
      <div className="container">
        <SectionHeader
          index="02"
          label="Record"
          meta={`${experience.length} entries`}
          titleId="record-title"
          title={
            <>
              Where I’ve been <em>shipping</em>
            </>
          }
        />

        <Timeline
          className={styles.timeline}
          trackClassName={styles.track}
          progressClassName={styles.progress}
        >
          <ol className={styles.entries}>
            {experience.map((job, i) => (
              <Entry key={`${job.company}-${job.start}`} job={job} index={i} />
            ))}
          </ol>
        </Timeline>
      </div>
    </section>
  );
}
