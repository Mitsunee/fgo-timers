import Link from "next/link";

import styles from "./EventCard.module.css";
import Overlay from "./Overlay";
import NoSSR from "@components/NoSSR";
import TimeDisplay from "./TimeDisplay";

export default function EventCard({
  title,
  shortTitle,
  slug,
  banner,
  startsAt,
  endsAt,
  interval
}) {
  return (
    <Link href={`/events/${slug}/`} passHref>
      <a className={styles.card} title={title}>
        <img src={`/banners/${banner}`} alt={slug} />
        <Overlay title={title} shortTitle={shortTitle} />
        <NoSSR>
          <TimeDisplay
            startsAt={startsAt}
            endsAt={endsAt}
            interval={interval}
          />
        </NoSSR>
      </a>
    </Link>
  );
}
