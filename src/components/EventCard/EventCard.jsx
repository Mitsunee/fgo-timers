import Link from "next/link";
import { useStore } from "@nanostores/react";

import styles from "./EventCard.module.css";
import { intervalStore } from "@stores/intervalStore";
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
  hideWhenDone
}) {
  const { interval } = useStore(intervalStore);

  if (hideWhenDone && (endsAt ? interval >= endsAt : interval >= startsAt)) {
    return null;
  }

  return (
    <Link href={`/events/${slug}/`} passHref>
      <a className={styles.card} title={title}>
        <img src={`/assets/events/${banner}`} alt={slug} />
        <Overlay title={title} shortTitle={shortTitle} />
        <NoSSR>
          <TimeDisplay startsAt={startsAt} endsAt={endsAt} />
        </NoSSR>
      </a>
    </Link>
  );
}
