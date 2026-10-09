interface ProjectTitleProps {
  title: string;
  /** Class for the part after the colon, which is set on its own line. */
  subClassName: string;
}

/**
 * Renders "Name: Description" as the name with the description on its own line.
 * The colon stays in the accessible text so screen readers hear the full title.
 */
export function ProjectTitle({ title, subClassName }: ProjectTitleProps) {
  const at = title.indexOf(": ");
  if (at === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <span className="visually-hidden">: </span>
      <span className={subClassName}>{title.slice(at + 2)}</span>
    </>
  );
}
