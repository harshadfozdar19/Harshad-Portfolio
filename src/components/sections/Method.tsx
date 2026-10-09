import { pipeline, sectionCopy } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pipeline } from "./method/Pipeline";
import styles from "./Method.module.css";

/** § 03 Method: the Frautect monitoring-to-investigation pipeline as a row of "stations" a packet travels through. */
export function Method() {
  return (
    <section id="method" className={`section ${styles.method}`} aria-labelledby="method-title">
      <div className="container">
        <SectionHeader
          index="03"
          label="Method"
          meta="Frautect · pipeline"
          title={
            <>
              How a target becomes a <em>verdict</em>
            </>
          }
          intro={sectionCopy.methodIntro}
          titleId="method-title"
        />

        <Pipeline steps={pipeline} />

        <Reveal delay={0.1}>
          <ul className={`label ${styles.traits}`} aria-label="Pipeline properties">
            {sectionCopy.methodTraits.map((trait) => (
              <li key={trait} className={styles.trait}>
                <span className={styles.sep} aria-hidden="true" />
                {trait}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
