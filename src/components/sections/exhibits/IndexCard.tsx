import type { Project } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { ProjectTitle } from "./ProjectTitle";
import styles from "./IndexCard.module.css";

/** A secondary project as an index card, with a dog-eared corner that folds further on hover. */
export function IndexCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <p className={styles.meta}>
        {project.category} · {project.period}
      </p>
      <h3 className={styles.title}>
        <ProjectTitle title={project.title} subClassName={styles.sub} />
      </h3>
      <p className={styles.summary}>{project.summary}</p>
      <ul className={styles.stack} aria-label="Stack">
        {project.stack.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}
