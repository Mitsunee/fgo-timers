import Image from "next/image";
import Link from "next/link";
import { useStore } from "@nanostores/react";
import { normalizeDate } from "src/time/normalizeDate";
import Headline from "src/client/components/Headline";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import { InlineIcon } from "src/client/components/InlineIcon";
import { IconHourglass } from "src/client/components/icons";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
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
  const { seconds: current } = useStore(intervalStore);
  const [start, end] = normalizeDate(date);
  const hasStarted = current >= start;
  const hasEnded = end > 0 && current >= end;
  const startMs = start * 1000;
  const endMs = (end || start) * 1000;

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
                Ended: <DisplayDate time={endMs} />
              </>
            ) : (
              <>
                {`${hasStarted ? "End" : "Start"}s: `}
                <DisplayDelta time={hasStarted ? endMs : startMs} />
              </>
            )
          ) : (
            <>
              Starts: <DisplayDate time={startMs} />
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

export function EventList({ children, events, title }: EventListProps) {
  if (events.length < 1) return null;

  return (
    <section>
      <Headline>{title || "Current Events"}</Headline>
      {children}
      <div className={styles.grid}>
        {events.map(event => (
          <EventListItem key={event.shortTitle} {...event} />
        ))}
      </div>
    </section>
  );
}
