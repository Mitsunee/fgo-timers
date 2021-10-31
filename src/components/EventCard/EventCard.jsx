import Link from "next/link";

import styles from "./EventCard.module.css";
import TimeDisplay from "./TimeDisplay";
import Overlay from "./Overlay";

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
        <TimeDisplay startsAt={startsAt} endsAt={endsAt} interval={interval} />
      </a>
    </Link>
  );
}
