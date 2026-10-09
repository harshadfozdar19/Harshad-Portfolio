import { explorations } from "@/content/profile";
import { Highlight } from "@/components/ui/Marks";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./Research.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** § 06 Open Questions: what Harshad is exploring next. The first question is the primary (inverted) card. */
export function Research() {
  return (
    <section id="research" className="section" aria-labelledby="research-title">
      <div className="container">
        <SectionHeader
          index="06"
          label="Open Questions"
          meta={`${explorations.length} open ${explorations.length === 1 ? "thread" : "threads"}`}
          title={
            <>
              What I’m <em>investigating</em> next
            </>
          }
          titleId="research-title"
        />

        <ol className={styles.grid}>
          {explorations.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 0.08}
              className={`${styles.card} ${i === 0 ? styles.primary : ""}`}
            >
              <span className={styles.code}>
                <span className={styles.dot} aria-hidden="true" />
                Q.{pad(i + 1)}
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              {item.quote ? (
                <blockquote className={styles.quote}>
                  <p>
                    <Highlight delay={0.35}>“{item.quote}”</Highlight>
                  </p>
                </blockquote>
              ) : null}
              <p className={styles.body}>{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
