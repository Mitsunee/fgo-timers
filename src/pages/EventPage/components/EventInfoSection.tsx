import spacetime from "spacetime";
import { LinkButton } from "~/client/components/Button";
import { DiscordTSButton } from "~/client/components/DiscordTSButton";
import Headline from "~/client/components/Headline";
import { Progress } from "~/client/components/Progress";
import Section from "~/client/components/Section";
import { DisplayDate } from "~/client/components/TimeDisplay";
import { useCurrentTime } from "~/client/utils/hooks/useCurrentTime";
import { useIsClient } from "~/client/utils/hooks/useIsClient";
import { formatDiff } from "~/time/formatDiff";
import { normalizeDate } from "~/time/normalizeDate";
import type { BundledEvent } from "~/events/types";
import styles from "./EventInfoSection.module.css";

type EventInfoSectionProps = Pick<
  BundledEvent,
  "title" | "date" | "requires" | "description" | "url" | "slug"
> & { modalCallback: () => void };

export function EventInfoSection({
  title,
  description,
  date,
  url,
  slug,
  requires,
  modalCallback
}: EventInfoSectionProps) {
  const isClient = useIsClient();
  const { current, s } = useCurrentTime();
  const [start, end] = normalizeDate(date);
  const hasStarted = current >= start;
  const hasEnded = end > 0 ? current >= end : hasStarted;
  let progressText: false | string = false;
  const officialUrl = `https://fate-go.us/news/?category=NEWS&article=%2Fiframe%2F${encodeURIComponent(
    url
  )}`;

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
        <LinkButton
          href={officialUrl}
          onClick={ev => {
            ev.preventDefault();
            modalCallback();
          }}>
          Official News Post
        </LinkButton>
        <DiscordTSButton time={date} title={title} slug={slug}>
          Copy Timestamp
        </DiscordTSButton>
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
        <p>
          <b>Start{isClient && hasStarted ? "ed" : "s"}:</b>{" "}
          <DisplayDate time={start} format="full" />
        </p>
        {end > 0 && (
          <p>
            <b>End{isClient && hasEnded ? "ed" : "s"}:</b>{" "}
            <DisplayDate time={end} format="full" />
          </p>
        )}
      </div>
    </Section>
  );
}
