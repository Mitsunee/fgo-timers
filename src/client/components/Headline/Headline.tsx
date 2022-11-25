import cc from "classcat";
import { PropsWithChildren } from "react";
import { CC } from "src/types/ComponentProps";

import styles from "./Headline.module.css";

interface HeadlineProps extends CC, PropsWithChildren {
  id?: string;
}

export default function Headline({ children, className, id }: HeadlineProps) {
  return (
    <h1 className={cc([styles.headline, className])} id={id}>
      {children}
    </h1>
  );
}
