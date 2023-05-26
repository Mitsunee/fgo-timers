import cc from "classcat";
import type { CC } from "~/types/ComponentProps";
import styles from "./Progress.module.css";

interface ProgressProps extends CC {
  /**
   * Replace Percentage display with text or disable text display entirely with `false`
   */
  text?: string | false;
  current: number;
  of: number;
}

export function Progress({ text, current, of, className }: ProgressProps) {
  const pct = `${Math.min(100, (current / of) * 100)
    .toFixed(2)
    .replace(/\.?0+$/, "")}%`;

  return (
    <div className={cc([styles.progress, className])}>
      <div style={{ "--w": pct } as React.CSSProperties}></div>
      <span>{text == false ? "" : text ?? pct}</span>
    </div>
  );
}
