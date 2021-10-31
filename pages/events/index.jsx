import { basename, extname } from "path";

import { getEventFileList } from "@utils/server/events/getEventFileList";
import { parseEventFile } from "@utils/server/events/parseEventFile";

import styles from "@styles/EventsPage.module.css";
import { useInterval } from "@utils/hooks/useInterval";
import Meta from "@components/Meta";
import EventCard from "@components/EventCard";

export default function EventsPage({ events }) {
  const interval = useInterval(1000);
  // TODO: Meta

  return (
    <>
      <Meta title="Events" description="Event Timers for Fate/Grand Order NA" />
      <section className={styles.grid}>
        {events.map(event => (
          <EventCard key={event.shortTitle} interval={interval} {...event} />
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

    if (typeof data.hideWhenDone !== "undefined") {
      // don't include events in data that are hidden already
      if (
        data.hideWhenDone &&
        ((typeof data.endsAt === "undefined" && data.startsAt < buildTime) ||
          (typeof data.endsAt === "number" && data.endsAt < buildTime))
      ) {
        continue;
      }

      event.hideWhenDone = data.hideWhenDone;
    }

    events.push(event);
  }

  events = events.sort((a, b) => {
    if (a.startsAt === b.startsAt) {
      return a.displayOrder - b.displayOrder;
    }
    return a.startsAt - b.startsAt;
  });

  return {
    props: { events }
  };
}
