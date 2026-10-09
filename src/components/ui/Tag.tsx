import type { ReactNode } from "react";
import styles from "./primitives.module.css";

interface TagProps {
  children: ReactNode;
  tone?: "default" | "signal";
  interactive?: boolean;
}

export function Tag({ children, tone = "default", interactive = false }: TagProps) {
  const className = [styles.tag, tone === "signal" && styles.tagSignal, interactive && styles.tagInteractive]
    .filter(Boolean)
    .join(" ");
  return <span className={className}>{children}</span>;
}
