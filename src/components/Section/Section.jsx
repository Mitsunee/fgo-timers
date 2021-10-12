import styles from "./Section.module.css";

export default function Section({
  children,
  background = false,
  padding = null,
  className = false,
  ...props
}) {
  const classNames = [styles.section];

  // with background enable padding unless explicitly false
  // without background enable padding if explicitly true
  if (background) {
    classNames.push(
      background === "blue" ? styles.backgroundBlue : styles.backgroundBlack
    );
    if (padding !== false) classNames.push(styles.padding);
  } else {
    if (padding) classNames.push(styles.padding);
  }

  if (className) classNames.push(className);

  return (
    <section className={classNames.join(" ")} {...props}>
      {children}
    </section>
  );
}
