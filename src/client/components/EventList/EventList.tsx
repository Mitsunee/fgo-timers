import Image from "next/image";
import Link from "next/link";
import Headline from "~/components/Headline";
import { IconHourglass } from "~/components/icons";
import { InlineIcon } from "~/components/InlineIcon";
import Section from "~/components/Section";
import { DisplayDate, DisplayDelta } from "~/components/TimeDisplay";
import { useCurrentTime } from "~/hooks/useCurrentTime";
import { useIsClient } from "~/hooks/useIsClient";
import { normalizeDate } from "~/time/normalizeDate";
import type { BasicEvent } from "~/events/types";
import styles from "./EventList.module.css";

type EventListItemProps = BasicEvent &
  Pick<React.ComponentProps<typeof Image>, "loading">;

interface EventListProps extends React.PropsWithChildren {
  events: BasicEvent[];
  title?: string;
  loading?: React.ComponentProps<typeof Image>["loading"];
}

export function EventListItem({
  loading,
  slug,
  title,
  shortTitle,
  date,
  banner
}: EventListItemProps) {
  const isClient = useIsClient();
  const { current } = useCurrentTime();
  const [start, end] = normalizeDate(date);
  const hasStarted = current >= start;
  const showStarted = end == 0 && hasStarted;
  const hasEnded = end > 0 && current >= end;

  return (
    <Link href={`/events/${slug}`} className={styles.link} title={title}>
      <article className={styles.item}>
        <h1>{title.length < 100 ? title : shortTitle}</h1>
        <Image
          src={`/assets/events/${banner}`}
          alt={shortTitle}
          className={styles.img}
          width={800}
          height={300}
          loading={loading ?? "lazy"}
        />
        <div className={styles.timer}>
          <InlineIcon icon={IconHourglass} />
          {!isClient ? (
            <>
              Starts: <DisplayDate time={start} />
            </>
          ) : showStarted ? (
            <>
              Started: <DisplayDate time={start} />
            </>
          ) : !hasStarted ? (
            <>
              Starts in: <DisplayDelta time={start} />
            </>
          ) : // we know end is > 0 now
          hasEnded ? (
            <>
              Ended: <DisplayDate time={end} />
            </>
          ) : (
            <>
              Ends in: <DisplayDelta time={end} />
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

export function EventList({
  children,
  events,
  title,
  loading
}: EventListProps) {
  return (
    <Section>
      <Headline>{title || "Current Events"}</Headline>
      {children}
      <div className={styles.grid}>
        {events.map(event => (
          <EventListItem key={event.shortTitle} loading={loading} {...event} />
        ))}
      </div>
    </Section>
  );
}
