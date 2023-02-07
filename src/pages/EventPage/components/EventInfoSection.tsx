import { useStore } from "@nanostores/react";
import spacetime from "spacetime";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import { normalizeDate } from "src/time/normalizeDate";
import { formatDiff } from "src/time/formatDiff";
import Section from "src/client/components/Section";
import Headline from "src/client/components/Headline";
import { Progress } from "src/client/components/Progress";
import { ActionButton } from "src/client/components/Button";
import { DiscordTSButton } from "src/client/components/DiscordTSButton";
import { DisplayDate } from "src/client/components/TimeDisplay";
import type { BundledEvent } from "src/events/types";
import styles from "./EventInfoSection.module.css";

type EventInfoSectionProps = Pick<
  BundledEvent,
  "title" | "date" | "requires" | "description"
> & { modalCallback: () => void };

export function EventInfoSection({
  title,
  description,
  date,
  requires,
  modalCallback
}: EventInfoSectionProps) {
  const isClient = useIsClient();
  const { seconds: current, s } = useStore(intervalStore);
  const [start, end] = normalizeDate(date);
  const hasStarted = current >= start;
  const hasEnded = end > 0 ? current >= end : hasStarted;
  let progressText: false | string = false;

  if (isClient && end > 0) {
    progressText = hasEnded
      ? "Ended"
      : `${hasStarted ? "Ends:" : "Starts:"} ${formatDiff(
          s.diff(spacetime((hasStarted ? end : start) * 1000))
        )}`;
  }

  return (
    <Section background="blue" padding={false} className={styles.section}>
      <Headline>{title}</Headline>
      {end > 0 && (
        <Progress
          current={isClient ? current - start : start}
          of={end - start}
          text={progressText}
        />
      )}
      <aside className={styles.flexbar}>
        {requires && <span>Requires: {requires}</span>}
        <ActionButton onClick={modalCallback}>Official News Post</ActionButton>
        <DiscordTSButton time={date}>Copy Timestamp</DiscordTSButton>
      </aside>
      <Section background padding={false}>
        {description
          .split("\n")
          .filter(seg => seg.trim().length > 0)
          .map((seg, i) => (
            <p key={i}>{seg}</p>
          ))}
      </Section>
      <div className={styles.times}>
        {isClient ? (
          <>
            <p>
              <b>Start{hasStarted ? "ed" : "s"}:</b>{" "}
              <DisplayDate time={start * 1000} format="full" />
            </p>
            {end > 0 && (
              <p>
                <b>End{hasEnded ? "ed" : "s"}:</b>{" "}
                <DisplayDate time={end * 1000} format="full" />
              </p>
            )}
          </>
        ) : (
          <>
            <p>
              <b>Start:</b> <DisplayDate time={start * 1000} format="full" />
            </p>
            {end > 0 && (
              <p>
                <b>End:</b> <DisplayDate time={end * 1000} format="full" />
              </p>
            )}
          </>
        )}
      </div>
    </Section>
  );
}
