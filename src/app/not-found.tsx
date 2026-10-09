import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Case not found",
};

/** Root 404: rendered for `notFound()` and for every unmatched URL. Next adds `noindex` automatically. */
export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <div className="container">
        <article className={styles.sheet} aria-labelledby="not-found-title">
          <header className={styles.meta}>
            <span className="label">Case file · Ref 404</span>
            <span className="label">Status: unresolved</span>
          </header>

          <h1 id="not-found-title" className={styles.title}>
            Case <em>not found</em>
          </h1>

          <p className={styles.body}>
            There is no record at this address. The file may have been moved, renamed, or it never existed.
          </p>

          <Link href="/" className={styles.link}>
            <span aria-hidden="true">←</span> Return to the case file
          </Link>

          <span className={styles.stamp} aria-hidden="true">
            No record
          </span>
        </article>
      </div>
    </main>
  );
}
