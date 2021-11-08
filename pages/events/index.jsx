import { basename, extname } from "path";

import { getEventFileList } from "@utils/server/events/getEventFileList";
import { parseEventFile } from "@utils/server/events/parseEventFile";

import styles from "@styles/EventsPage.module.css";
import Meta from "@components/Meta";
import Clocks from "@components/Clocks";
import Headline from "@components/Headline";
import EventCard from "@components/EventCard";

export default function EventsPage({ events }) {
  return (
    <>
      <Meta title="Events" description="Event Timers for Fate/Grand Order NA" />
      <Clocks />
      <Headline>Current Events</Headline>
      <section className={styles.grid}>
        {events.map(event => (
          <EventCard key={event.shortTitle} {...event} />
        ))}
      </section>
    </>
  );
}

export async function getStaticProps() {
  const fileList = await getEventFileList();
  const buildTime = Date.now();
  let events = new Array();

  for (const file of fileList) {
    const data = await parseEventFile(file);
    const event = {
      title: data.title,
      shortTitle: data.shortTitle,
      slug: basename(file, extname(file)),
      banner: data.banner,
      startsAt: data.startsAt,
      displayOrder: data.displayOrder ?? 0
    };

    if (typeof data.endsAt !== "undefined") {
      event.endsAt = data.endsAt;
    }

    // don't include events in data that are hidden already
    if (
      data.hideWhenDone === true &&
      ((typeof data.endsAt === "undefined" && data.startsAt < buildTime) ||
        (typeof data.endsAt === "number" && data.endsAt < buildTime))
    ) {
      continue;
    }

    events.push(event);
  }

  events = events.sort((a, b) => {
    if (a.startsAt === b.startsAt) {
      return a.displayOrder - b.displayOrder;
    }

    return a.startsAt - b.startsAt;
  });

  return { props: { events } };
}
