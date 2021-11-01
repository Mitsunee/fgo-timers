import { basename, extname } from "path";

import { getEventFileList } from "@utils/server/events/getEventFileList";
import { resolveFilePath } from "@utils/server/resolveFilePath";
import { parseEventFile } from "@utils/server/events/parseEventFile";

import styles from "@styles/EventPage.module.css";
import { useInterval } from "@utils/hooks/useInterval";
import Meta from "@components/Meta";
import { InfoTable } from "@components/InfoTable";
import EventTimeRow from "@components/EventTimeRow";

export default function EventPage(
  debug
  /*
{
  title,
  banner,
  url,
  startsAt,
  endsAt,
  times
}
*/
) {
  const interval = useInterval(1000);
  // TEMP:
  const {
    title,
    shortTitle,
    banner,
    url,
    startsAt,
    endsAt = null,
    times = []
  } = debug;

  return (
    <>
      <Meta
        title={title}
        headerTitle="Events"
        image={`/banners/${banner}`}
        description={`Event Timers for ${title}`}
        headerDescription={`Event Timers for ${shortTitle}`}
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
      <InfoTable>
        <thead>
          <tr>
            <th colSpan={2}>{title}</th>
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
        </tbody>
      </InfoTable>
      <code>
        <pre>{JSON.stringify(debug, null, 2)}</pre>
      </code>
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
