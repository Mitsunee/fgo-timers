import { useEffect, useState } from "react";
import cc from "classcat";
import { Button } from "@components/Button";
import Headline from "@components/Headline";
import { IconArrow, IconClose } from "@components/icons";
import Section from "@components/Section";
import styles from "./CollapsableSection.module.css";

// TODO: rewrite with new ActionButton component

export default function CollapsableSection({
  children,
  background,
  summary,
  openDefault = false,
  closeable = false
}) {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const isInline = !background;

  useEffect(() => {
    setOpen(closeable ? true : openDefault);
  }, [openDefault, closeable]);

  const handleButton = ev => {
    ev.target.blur();
    if (closeable) {
      setVisible(false);
    } else {
      setOpen(state => !state);
    }
  };

  if (!visible) return null; // TEMP: temporary fix

  return (
    visible && (
      <Section
        background={background}
        className={cc([styles.section, isInline && styles.inline])}>
        {isInline ? (
          <Button
            className={cc([styles.button, styles.inline, open && styles.open])}
            disableDefaultStyle
            iconComponent={closeable ? IconClose : IconArrow}
            iconSize="0.75em"
            onClick={handleButton}>
            {summary}
          </Button>
        ) : (
          <>
            <Button
              className={cc([styles.button, styles.float, open && styles.open])}
              disableDefaultStyle
              iconComponent={closeable ? IconClose : IconArrow}
              onClick={handleButton}
            />
            {summary && (
              <Headline className={styles.headline}>{summary}</Headline>
            )}
          </>
        )}
        {open && <div>{children}</div>}
      </Section>
    )
  );
}
