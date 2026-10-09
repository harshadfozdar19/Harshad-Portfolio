import { Fragment, type ComponentType } from "react";
import type { FeaturedProject, ProjectVisual } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { ProjectTitle } from "./ProjectTitle";
import { EvaluationVisual } from "./visuals/EvaluationVisual";
import { RadarVisual } from "./visuals/RadarVisual";
import { RagVisual } from "./visuals/RagVisual";
import styles from "./ExhibitFolder.module.css";

const VISUALS: Record<ProjectVisual, ComponentType> = {
  rag: RagVisual,
  evaluation: EvaluationVisual,
  radar: RadarVisual,
};

/** The flow each diagram illustrates, captioned under it. Pending a move into `src/content/profile.ts`. */
const VISUAL_FLOWS: Record<ProjectVisual, string[]> = {
  rag: ["ingest", "chunk", "embed", "retrieve", "generate"],
  evaluation: ["submit", "evaluate", "score", "track"],
  radar: ["discover", "extract", "dedupe", "enrich", "queue"],
};

interface ExhibitFolderProps {
  project: FeaturedProject;
  /** Put the diagram on the right on wide screens, to alternate down the page. */
  flip?: boolean;
}

/** A featured project as an evidence folder: an "EXHIBIT X" tab, a diagram panel and the write-up. */
export function ExhibitFolder({ project, flip = false }: ExhibitFolderProps) {
  const Visual = VISUALS[project.visual];
  const flow = VISUAL_FLOWS[project.visual];

  return (
    <article className={styles.folder} data-flip={flip || undefined}>
      <p className={styles.tab}>Exhibit {project.exhibit}</p>

      <div className={styles.body}>
        <figure className={styles.visual}>
          <div className={styles.canvas}>
            <Visual />
          </div>
          <figcaption className={styles.caption}>
            {flow.map((stage, i) => (
              <Fragment key={stage}>
                {i > 0 ? <span className={styles.arrow}> → </span> : null}
                {stage}
              </Fragment>
            ))}
          </figcaption>
        </figure>

        <div className={styles.content}>
          <p className={styles.meta}>
            {project.category} · {project.period}
          </p>
          <h3 className={styles.title}>
            <ProjectTitle title={project.title} subClassName={styles.sub} />
          </h3>
          <p className={styles.summary}>{project.summary}</p>
          <ul className={styles.points}>
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ul className={styles.stack} aria-label="Stack">
            {project.stack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
