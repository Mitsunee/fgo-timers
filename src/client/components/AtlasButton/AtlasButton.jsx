import cc from "classcat";

import styles from "./AtlasButton.module.css";
import { IconAtlas } from "@components/icons";
import { Button } from "@components/Button";

export default function AtlasButton({
  children,
  link,
  na = false,
  inline = false
}) {
  const href = `https://apps.atlasacademy.io/db/${na ? "NA" : "JP"}/${link}`;

  return (
    <Button
      href={href}
      targetBlank
      iconComponent={IconAtlas}
      iconSide="right"
      className={cc([styles.button, inline && styles.inline])}
      disableDefaultStyle={inline}>
      {children}
    </Button>
  );
}
