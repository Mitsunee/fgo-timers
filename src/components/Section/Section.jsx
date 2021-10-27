import cc from "classcat";

import styles from "./Section.module.css";

export default function Section({
  children,
  background = false,
  padding = null,
  className,
  ...props
}) {
  return (
    <section
      className={cc([
        styles.section,
        background &&
          (background === "blue"
            ? styles.backgroundBlue
            : styles.backgroundBlack),
        (padding || (background && padding !== false)) && styles.padding,
        className
      ])}
      {...props}>
      {children}
    </section>
  );
}
