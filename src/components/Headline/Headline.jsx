import styles from "./Headline.module.css";

export default function Headline({ children, className }) {
  return (
    <h1
      className={
        className ? `${styles.headline} ${className}` : styles.headline
      }>
      {children}
    </h1>
  );
}
