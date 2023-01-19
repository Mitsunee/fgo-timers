import { useStore } from "@nanostores/react";
import spacetime from "spacetime";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import Section from "src/client/components/Section";
import Headline from "src/client/components/Headline";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import type { BundledEvent } from "src/events/types";
import styles from "./EventInfoSection.module.css";
import { ActionButton } from "@components/Button";
import { Progress } from "@components/Progress";
import { formatDiff } from "src/utils/formatDiff";

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
  const [start, end = 0] = Array.isArray(date) ? date : [date];
  const hasStarted = current >= start;
  const hasEnded = end > 0 ? current >= end : !hasStarted;
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
      </aside>
      {description
        .split("\n")
        .filter(seg => seg.length > 0)
        .map((seg, i) => (
          <p key={i}>{seg}</p>
        ))}
      {isClient ? (
        <>
          <p>
            <b>Start{hasStarted ? "ed" : "s"}:</b>{" "}
            <DisplayDate time={start * 1000} format="full" />
            {start > current && (
              <>
                {" ("}
                <DisplayDelta time={start * 1000} />
                {")"}
              </>
            )}
          </p>
          {end > 0 && (
            <p>
              <b>End{hasEnded ? "ed" : "s"}:</b>{" "}
              <DisplayDate time={end * 1000} format="full" />
              {end > current && (
                <>
                  {" ("}
                  <DisplayDelta time={end * 1000} />
                  {")"}
                </>
              )}
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
              <b>
                End: <DisplayDate time={end * 1000} format="full" />
              </b>
            </p>
          )}
        </>
      )}
    </Section>
  );
}
