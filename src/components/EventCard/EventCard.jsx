import Link from "next/link";
import { useStore } from "@nanostores/react";

//import styles from "./EventCard.module.css";
import { intervalStore } from "@stores/intervalStore";
import Container from "./Container";
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
    <Link href={`/events/${slug}/`} passHref key={shortTitle}>
      <Container
        title={title}
        shortTitle={shortTitle}
        banner={banner}
        slug={slug}>
        <Overlay title={title} shortTitle={shortTitle} />
        <NoSSR>
          <TimeDisplay startsAt={startsAt} endsAt={endsAt} />
        </NoSSR>
      </Container>
    </Link>
  );
}
