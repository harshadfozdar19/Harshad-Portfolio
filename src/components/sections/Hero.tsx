import { Highlight } from "@/components/ui/Marks";
import { profile } from "@/content/profile";
import { CaseStamp } from "./hero/CaseStamp";
import { EvidenceBoard } from "./hero/EvidenceBoard";
import { InvestigationLog } from "./hero/InvestigationLog";
import { RoleTicker } from "./hero/RoleTicker";
import { splitPhrases } from "@/lib/splitPhrases";
import styles from "./Hero.module.css";

/** Phrases inside `profile.summary` that get the highlighter. Missing phrases are skipped. */
const SUMMARY_EMPHASIS = ["AI investigation systems", "LangGraph + Gemini agent", "structured risk verdicts"];

const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
const caseNumber = `${initials}-${profile.year}`;
const city = profile.location.split(",")[0]?.trim() ?? profile.location;
const summary = splitPhrases(profile.summary, SUMMARY_EMPHASIS);

/**
 * Case-file cover: metadata strip, the name, the rotating "I engineer …" line and the
 * summary on the left; a pinned link-analysis board and the agent's teleprinter log on
 * the right. Only the animated leaves are client components.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>
              Case file<span className={styles.metaDot}> ·</span>
            </dt>
            <dd>{caseNumber}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Subject:</dt>
            <dd>{profile.name}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Status:</dt>
            <dd>
              <span className={styles.live} aria-hidden="true" />
              Active
            </dd>
          </div>
          <div className={styles.metaItem}>
            <dt>
              <abbr title="Location">Loc</abbr>:
            </dt>
            <dd>{city}, IN</dd>
          </div>
        </dl>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <h1 id="hero-title" className={styles.name}>
              <span className={styles.line}>
                <span className={styles.rise}>{profile.firstName}</span>
              </span>{" "}
              <span className={styles.lastRow}>
                <span className={styles.line}>
                  <span className={`${styles.rise} ${styles.last}`}>{profile.lastName}</span>
                </span>
                <span className={styles.stampSlot} aria-hidden="true">
                  <span className={styles.stampTilt}>
                    <CaseStamp className={styles.stamp} delay={1.05}>
                      <span className={styles.stampMain}>On file</span>
                      <span className={styles.stampSub}>AI · OSINT · Full stack</span>
                    </CaseStamp>
                  </span>
                </span>
              </span>
            </h1>

            <p className={styles.roleLine}>
              I engineer <RoleTicker roles={profile.roles} />
            </p>

            <p className={styles.summary}>
              {summary.map((segment, index) =>
                segment.match === null ? (
                  segment.text
                ) : (
                  <Highlight key={index} delay={0.9 + 0.25 * segment.match}>
                    {segment.text}
                  </Highlight>
                ),
              )}
            </p>

            <div className={styles.ctas}>
              <a href="#exhibits" className={styles.primary}>
                Open the exhibits
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </a>
              <a href="#contact" className={styles.secondary}>
                Get in touch
              </a>
              {profile.resume ? (
                <a
                  href={profile.resume}
                  download={`${profile.firstName}_${profile.lastName}_Resume.pdf`}
                  className={styles.secondary}
                >
                  Résumé <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
          </div>

          <div className={styles.evidence}>
            <EvidenceBoard />
            <InvestigationLog className={styles.log} />
          </div>
        </div>

        <div className={styles.foot}>
          <a href="#profile" className={styles.scroll}>
            <span className={styles.scrollLine} aria-hidden="true" />
            Scroll <span aria-hidden="true">↓</span>
          </a>
          <p className={styles.modes}>
            <span>Open to</span> {profile.workModes}
          </p>
        </div>

        <span className={`${styles.reg} ${styles.regA}`} aria-hidden="true" />
        <span className={`${styles.reg} ${styles.regB}`} aria-hidden="true" />
      </div>
    </section>
  );
}
