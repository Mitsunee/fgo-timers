import styles from "./AtlasButton.module.css";
import { IconAtlas } from "@components/icons";
import { Button } from "@components/Button";

export default function AtlasButton({ link, na = false, inline = false }) {
  const href = `https://apps.atlasacademy.io/db/${na ? "NA" : "JP"}/${link}`;

  return (
    <Button
      href={href}
      targetBlank
      iconComponent={IconAtlas}
      className={inline ? `${styles.button} ${styles.inline}` : styles.button}
      disableDefaultStyle={inline}
    />
  );
}
