import { basename, extname } from "path";

import { getEventFileList } from "@utils/server/events/getEventFileList";
import { resolveFilePath } from "@utils/server/resolveFilePath";
import { parseEventFile } from "@utils/server/events/parseEventFile";

import styles from "@styles/EventPage.module.css";
import { useInterval } from "@utils/hooks/useInterval";
import Meta from "@components/Meta";
import { InfoTable } from "@components/InfoTable";
import EventTimeRow from "@components/EventTimeRow";

export default function EventPage({
  title,
  shortTitle,
  banner,
  url,
  startsAt,
  endsAt = null,
  times = []
}) {
  const interval = useInterval(1000);

  // TODO: Description section

  return (
    <>
      <Meta
        title={title}
        headerTitle="Events"
        image={`/banners/${banner}`}
        description={`Event Timers for ${title}`}
        headerDescription={`Event Timers for ${shortTitle}`}
        noTitleSuffix
      />
      <div className={styles.header}>
        {/* TODO: Modal */}
        <a
          href={`https://webview.fate-go.us/${url}`}
          target="_blank"
          rel="noreferrer noopener">
          <img src={`/banners/${banner}`} alt={title} />
        </a>
      </div>
      <InfoTable background className={styles.table}>
        <thead>
          <tr>
            <th colSpan={3}>{title}</th>
          </tr>
          <tr className={styles.headerRow}>
            <th>#</th>
            <th>in</th>
            <th>at</th>
          </tr>
        </thead>
        <tbody>
          <EventTimeRow
            title={startsAt > interval ? "Starts" : "Started"}
            interval={interval}
            target={startsAt}
          />
          {endsAt !== null && (
            <EventTimeRow
              title={endsAt > interval ? "Ends" : "Ended"}
              interval={interval}
              target={endsAt}
            />
          )}
          {times.map((time, idx) => {
            // TODO: rotating events
            // skip finished times where hideWhenDone is set
            if (
              time.hideWhenDone &&
              ((time.endsAt && interval > time.endsAt) ||
                (!time.endsAt && interval > time.startsAt))
            ) {
              return null;
            }

            return (
              <EventTimeRow
                key={idx}
                title={time.title}
                interval={interval}
                target={
                  time.startsAt > interval
                    ? time.startsAt
                    : time.endsAt || time.startsAt
                }
              />
            );
          })}
        </tbody>
      </InfoTable>
    </>
  );
}

export async function getStaticPaths() {
  const fileList = await getEventFileList();
  const paths = fileList.map(file => ({
    params: {
      slug: basename(file, extname(file))
    }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const filePath = resolveFilePath(`assets/data/events/${slug}.yml`);
  const { title, shortTitle, banner, url, startsAt, ...data } =
    await parseEventFile(filePath);
  const props = { title, shortTitle, banner, url, startsAt };

  if (typeof data.endsAt !== "undefined") {
    props.endsAt = data.endsAt;
  }

  if (typeof data.times !== "undefined") {
    props.times = data.times;
  }

  return { props };
}
