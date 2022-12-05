import cc from "classcat";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import styles from "./Section.module.css";

// TODO: maybe Backgrounds enum?

interface SectionProps extends ComponentPropsCC<"section"> {
  background?: boolean | "blue";
  padding?: null | boolean;
}

export default function Section({
  children,
  background = false,
  padding = null,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      className={cc([
        styles.section,
        background &&
          (background === "blue"
            ? styles.backgroundBlue
            : styles.backgroundBlack),
        (padding || (background && padding !== false)) && styles.padding,
        className
      ])}>
      {children}
    </section>
  );
}