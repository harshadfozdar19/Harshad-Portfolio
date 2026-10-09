import { credentials, education } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./Credentials.module.css";

/** Splits "7.70 CGPA" into a display value and a unit; falls back to the whole string. */
function splitGrade(grade: string): { value: string; unit: string } {
  const match = /^([\d.,/]+)\s+(.+)$/.exec(grade.trim());
  return match ? { value: match[1], unit: match[2] } : { value: grade, unit: "" };
}

/** Five-point star centred in a 100×100 viewBox. */
const STAR_POINTS =
  "50,36 53.53,45.15 63.31,45.67 55.71,51.85 58.23,61.33 50,56 41.77,61.33 44.29,51.85 36.69,45.67 46.47,45.15";

/** Decorative certificate seal: hairline vermilion rings, ring text and a star. */
function Seal({ pathId }: { pathId: string }) {
  return (
    <svg className={styles.seal} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <path id={pathId} d="M 14,50 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
      </defs>
      <circle className={styles.sealRing} cx="50" cy="50" r="47" />
      <circle className={styles.sealRing} cx="50" cy="50" r="29" />
      <text className={styles.sealText}>
        <textPath href={`#${pathId}`} textLength="224" lengthAdjust="spacing">
          VERIFIED · ON FILE · VERIFIED · ON FILE ·
        </textPath>
      </text>
      <polygon className={styles.sealStar} points={STAR_POINTS} />
    </svg>
  );
}

/** § 07 Credentials: the education transcript and certificate cards. */
export function Credentials() {
  const grade = splitGrade(education.grade);

  return (
    <section id="credentials" className="section" aria-labelledby="credentials-title">
      <div className="container">
        <SectionHeader
          index="07"
          label="Credentials"
          meta="Education & certificates"
          title={
            <>
              Always <em>learning</em>
            </>
          }
          titleId="credentials-title"
        />

        <Reveal as="article" className={styles.transcript}>
          <div className={styles.school}>
            <p className="label">Transcript</p>
            <h3 className={styles.schoolName}>{education.school}</h3>
            <p className={styles.degree}>{education.degree}</p>
            <p className={styles.location}>{education.location}</p>
          </div>
          <dl className={styles.result}>
            <div className={styles.grade}>
              <dt className="visually-hidden">Grade</dt>
              <dd>
                <span className={styles.gradeValue}>{grade.value}</span>
                {grade.unit ? (
                  <>
                    {" "}
                    <span className={styles.gradeUnit}>{grade.unit}</span>
                  </>
                ) : null}
              </dd>
            </div>
            <div className={styles.period}>
              <dt className="visually-hidden">Period</dt>
              <dd>{education.period}</dd>
            </div>
          </dl>
        </Reveal>

        <ul className={styles.certs}>
          {credentials.map((cert, i) => (
            <Reveal as="li" key={cert.title} delay={0.08 + i * 0.07} className={styles.certItem}>
              <article className={styles.cert}>
                <div className={styles.certTop}>
                  <p className={styles.certMeta}>
                    <span>{cert.issuer}</span>
                    {cert.date ? <span className={styles.certDate}>{cert.date}</span> : null}
                  </p>
                  <Seal pathId={`credential-seal-${i + 1}`} />
                </div>
                <h3 className={styles.certTitle}>{cert.title}</h3>
                <p className={styles.certDetail}>{cert.detail}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
