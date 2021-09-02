import styles from "./Headline.module.css";

export default function Headline({ children, className, id }) {
  return (
    <h1
      className={
        className ? `${styles.headline} ${className}` : styles.headline
      }
      id={id}>
      {children}
    </h1>
  );
}
