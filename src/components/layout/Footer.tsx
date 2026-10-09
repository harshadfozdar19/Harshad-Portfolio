import { profile, sectionCopy } from "@/content/profile";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {profile.year} {profile.name}
        </p>
        <p className={styles.tagline}>{sectionCopy.footerTagline}</p>
        <p>{sectionCopy.colophon}</p>
        <a className={styles.top} href="#main">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
