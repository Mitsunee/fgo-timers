import Image from "next/image";
import Link from "next/link";
import Headline from "src/client/components/Headline";
import { IconHourglass } from "src/client/components/icons";
import { InlineIcon } from "src/client/components/InlineIcon";
import Section from "src/client/components/Section";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { normalizeDate } from "src/time/normalizeDate";
import type { BasicEvent } from "src/events/types";
import styles from "./EventList.module.css";

type EventListItemProps = BasicEvent;

interface EventListProps extends React.PropsWithChildren {
  events: BasicEvent[];
  title?: string;
}

export function EventListItem({
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
        />
        <div className={styles.timer}>
          <InlineIcon icon={IconHourglass} />
          {isClient ? (
            hasEnded ? (
              <>
                Ended: <DisplayDate time={end || start} />
              </>
            ) : (
              <>
                {`${hasStarted ? "End" : "Start"}s: `}
                <DisplayDelta time={hasStarted && end ? end : start} />
              </>
            )
          ) : (
            <>
              Starts: <DisplayDate time={start} />
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

export function EventList({ children, events, title }: EventListProps) {
  return (
    <Section>
      <Headline>{title || "Current Events"}</Headline>
      {children}
      <div className={styles.grid}>
        {events.map(event => (
          <EventListItem key={event.shortTitle} {...event} />
        ))}
      </div>
    </Section>
  );
}
