import styles from "./Clock.module.css";

interface ClockProps {
  children: string;
  title: string;
}

export default function Clock({ children, title }: ClockProps) {
  return (
    <div className={styles.clock}>
      <h1>{title}</h1>
      <h2>{children}</h2>
    </div>
  );
}
