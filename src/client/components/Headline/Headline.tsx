import cc from "classcat";
import { CC } from "src/types/ComponentProps";

import styles from "./Headline.module.css";

interface HeadlineProps extends CC, React.PropsWithChildren {
  id?: string;
}

export default function Headline({ children, className, id }: HeadlineProps) {
  return (
    <h1 className={cc([styles.headline, className])} id={id}>
      {children}
    </h1>
  );
}
