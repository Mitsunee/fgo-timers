import { useState, useEffect } from "react";
import styles from "./CollapsableSection.module.css";
import Section from "@components/Section";
import { Button } from "@components/Button";
import { IconClose, IconArrow } from "@components/icons";
import Headline from "@components/Headline";

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

  return (
    visible && (
      <Section
        background={background}
        className={
          isInline ? `${styles.section} ${styles.inline}` : styles.section
        }>
        {isInline ? (
          <Button
            className={`${styles.button} ${styles.inline}${
              open ? " " + styles.open : ""
            }`}
            disableDefaultStyle
            iconComponent={closeable ? IconClose : IconArrow}
            iconSize="0.75em"
            onClick={handleButton}>
            {summary}
          </Button>
        ) : (
          <>
            <Button
              className={`${styles.button} ${styles.float}${
                open ? " " + styles.open : ""
              }`}
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
