import { basename, extname } from "path";

import { getEventFileList } from "@utils/server/events/getEventFileList";
import { parseEventFile } from "@utils/server/events/parseEventFile";

import styles from "@styles/EventsPage.module.css";
import Headline from "@components/Headline";
import { useIsClient } from "@utils/hooks/useIsClient";

export default function EventsPage({ events }) {
  const isClient = useIsClient();

  // DEBUG
  if (isClient) {
    //console.log({ events });
  }
  // TODO: Meta

  return (
    <>
      <Headline>PLACEHOLDER - EVENTS</Headline>
      <section className={styles.grid}>
        {
          // PLACEHOLDER
          events.map(event => (
            <div key={event.shortTitle}>
              <img src={`/banners/${event.banner}`} alt={event.shortTitle} />
            </div>
          ))
        }
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
      startsAt: data.startsAt
    };

    if (typeof data.endsAt !== "undefined") {
      event.endsAt = data.endsAt;
    }

    if (typeof data.hideWhenDone !== "undefined") {
      event.hideWhenDone = data.hideWhenDone;

      // don't include events in data that are hidden already
      if (
        event.hideWhenDone &&
        ((typeof data.endsAt === "undefined" && data.startsAt < buildTime) ||
          (typeof data.endsAt === "number" && data.endsAt < buildTime))
      ) {
        continue;
      }
    }

    events.push(event);
  }

  // TODO: priority prop to sort by if startsAt is the same?
  events = events.sort((a, b) => a.startsAt - b.startsAt);

  return {
    props: { events }
  };
}
