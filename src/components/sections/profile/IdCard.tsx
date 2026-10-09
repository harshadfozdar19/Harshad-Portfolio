import Image from "next/image";
import { profile } from "@/content/profile";
import { Stamp } from "./Stamp";
import styles from "./IdCard.module.css";

const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

/*
 * Portrait paths come from env (see profile.ts). The duotone is the default face of the card;
 * when the colour version also exists it sits on top, transparent, and fades in on hover/focus.
 * With neither set (fresh clone / CI) the frame shows the monogram, so nothing can 404.
 */
const basePhoto = profile.photoMono || profile.photo;
const hoverPhoto = profile.photoMono && profile.photo ? profile.photo : undefined;
const imageSizes = "(max-width: 900px) 80vw, 360px";

const rows: { term: string; detail: string }[] = [
  { term: "Role", detail: profile.role },
  { term: "Pronouns", detail: profile.pronouns },
  { term: "Location", detail: profile.location },
  { term: "Issued", detail: String(profile.year) },
];

/** The subject's press badge: portrait (or monogram), identity rows, barcode and a "verified" stamp. */
export function IdCard() {
  return (
    <div className={styles.card}>
      <span className={styles.slot} aria-hidden="true" />

      <div className={styles.head} aria-hidden="true">
        <span>Personnel file</span>
        <span>
          {initials}-{profile.year}
        </span>
      </div>

      <figure className={styles.figure}>
        <div className={styles.frame}>
          {basePhoto ? (
            <>
              <Image
                src={basePhoto}
                alt={`Portrait of ${profile.name}`}
                width={720}
                height={900}
                sizes={imageSizes}
                className={styles.image}
              />
              {hoverPhoto ? (
                <Image
                  src={hoverPhoto}
                  alt=""
                  aria-hidden="true"
                  width={720}
                  height={900}
                  sizes={imageSizes}
                  className={`${styles.image} ${styles.colour}`}
                />
              ) : null}
            </>
          ) : (
            <span className={styles.monogram} aria-hidden="true">
              {initials}
            </span>
          )}
        </div>
        <figcaption className={styles.caption} aria-hidden="true">
          Fig. 1 — Subject
        </figcaption>
      </figure>

      <div className={styles.nameRow}>
        <p className={styles.name}>
          <span>{profile.firstName}</span> <span>{profile.lastName}</span>
        </p>
        <Stamp className={styles.stamp}>Verified</Stamp>
      </div>

      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.term} className={styles.row}>
            <dt>{row.term}</dt>
            <dd>{row.detail}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.code} aria-hidden="true">
        <span className={styles.barcode} />
        <span className={styles.digits}>
          {initials} {profile.year} 0001
        </span>
      </div>
    </div>
  );
}
