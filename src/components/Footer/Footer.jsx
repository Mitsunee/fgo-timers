import cc from "classcat";

import styles from "./Footer.module.css";
import { useFooterFixed } from "@utils/hooks/useFooterFixed";

export default function Footer() {
  const fixed = useFooterFixed();

  return (
    <footer className={cc([styles.footer, fixed && styles.fixed])}>
      {"Made by "}
      <a
        href="https://twitter.com/mitsunee"
        target="_blank"
        rel="noopener noreferrer">
        Mitsunee
      </a>{" "}
      | &ldquo;Fate/Grand Order&rdquo; is a trademark of Notes Co., Ltd. | Game
      Assets &copy; Aniplex Inc. used under fair use.
      <br />
      {"Thanks to: "}
      <a
        href="https://atlasacademy.io/"
        target="_blank"
        rel="noopener noreferrer">
        Atlas Academy
      </a>
      {" for their Game Data API, "}
      <a
        href="https://github.com/spencermountain/spacetime"
        target="_blank"
        rel="noopener noreferrer">
        Spacetime
      </a>
      {" for timezone conversion, "}
      <a
        href="https://iconmonstr.com/"
        target="_blank"
        rel="noopener noreferrer">
        iconmonstr
      </a>
      {" vector icons"}
    </footer>
  );
}
