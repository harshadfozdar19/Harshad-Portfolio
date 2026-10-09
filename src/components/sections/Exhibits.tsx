import { featuredProjects, projects } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExhibitFolder } from "./exhibits/ExhibitFolder";
import { IndexCard } from "./exhibits/IndexCard";
import styles from "./Exhibits.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** § 04 Exhibits: featured projects as evidence folders, then the rest as a grid of index cards. */
export function Exhibits() {
  const total = featuredProjects.length + projects.length;

  return (
    <section id="exhibits" className="section" aria-labelledby="exhibits-title">
      <div className="container">
        <SectionHeader
          index="04"
          label="Exhibits"
          meta={`${total} on file`}
          title={
            <>
              Selected <em>work</em>
            </>
          }
          titleId="exhibits-title"
        />

        <div className={styles.folders}>
          {featuredProjects.map((project, i) => (
            <Reveal key={project.exhibit} y={36}>
              <ExhibitFolder project={project} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>

        <Reveal className={`label ${styles.subhead}`}>
          <span id="exhibits-more" className={styles.subheadLabel}>
            <span className={styles.square} aria-hidden="true" />
            Also on file
          </span>
          <span>{pad(projects.length)} files</span>
        </Reveal>

        <ul className={styles.grid} aria-labelledby="exhibits-more">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.title} delay={(i % 3) * 0.08} className={styles.gridItem}>
              <IndexCard project={project} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
