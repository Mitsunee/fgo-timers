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
  start,
  end
}) {
  return (
    <Link href={`/events/${slug}/`} passHref>
      <a className={styles.card} title={title}>
        <img src={`/assets/events/${banner}`} alt={slug} />
        <Overlay title={title} shortTitle={shortTitle} />
        <NoSSR>
          <TimeDisplay start={start} end={end} />
        </NoSSR>
      </a>
    </Link>
  );
}
