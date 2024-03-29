import type { RequiredChildren } from "~/types/ComponentProps";
import styles from "./Clock.module.css";

interface ClockProps {
  children: RequiredChildren;
  title: string;
}

export function Clock({ children, title }: ClockProps) {
  return (
    <div className={styles.clock}>
      <h1>{title}</h1>
      <h2>{children}</h2>
    </div>
  );
}
