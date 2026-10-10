import { profile, sectionCopy } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { CopyEmail } from "./contact/CopyEmail";
import styles from "./Contact.module.css";

/** Lets long addresses break cleanly at the "@" on narrow screens. */
function BreakableEmail({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at <= 0) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}

/** § 08 Contact: the closer. */
export function Contact() {
  return (
    <section id="contact" className={`section ${styles.contact}`} aria-labelledby="contact-title">
      {/* Decorative: rendered via CSS `content` so it stays out of the accessibility tree and contrast checks. */}
      <span className={styles.watermark} aria-hidden="true" data-text="Case open" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <SectionHeader
            index="08"
            label="Contact"
            title={
              <>
                Let’s open a <em>new case</em>.
              </>
            }
            titleId="contact-title"
          />
        </div>

        <div className={styles.brief}>
          <Reveal>
            <p className={styles.lead}>{sectionCopy.contactLead}</p>
          </Reveal>
          <Reveal delay={0.1} className={styles.openTo}>
            <p className="label" id="contact-open-to">
              Open to
            </p>
            <ul className={styles.tags} aria-labelledby="contact-open-to">
              {profile.openTo.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.05} className={styles.channels}>
          <p className="label">Write to</p>
          <p className={styles.emailLine}>
            <a className={styles.email} href={`mailto:${profile.email}`}>
              <BreakableEmail email={profile.email} />
            </a>
          </p>
          <div className={styles.actions}>
            <CopyEmail email={profile.email} className={styles.action} />
            <a className={styles.action} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            {profile.resume ? (
              <a
                className={styles.action}
                href={profile.resume}
                download={`${profile.firstName}_${profile.lastName}_Resume.pdf`}
              >
                Résumé (PDF) <span aria-hidden="true">↓</span>
              </a>
            ) : null}
          </div>
        </Reveal>

        <dl className={styles.facts}>
          <div>
            <dt className="label">Based in</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt className="label">Work modes</dt>
            <dd>{profile.workModes}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
