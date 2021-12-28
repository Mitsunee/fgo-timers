import { useState } from "react";
import { useStore } from "@nanostores/react";

import { basename, extname } from "path";
import { getEventFileList } from "@utils/server/events/getEventFileList";
import { resolveFilePath } from "@utils/server/resolveFilePath";
import { parseEventFile } from "@utils/server/events/parseEventFile";

import styles from "@styles/EventPage.module.css";
import { intervalStore } from "@stores/intervalStore";
import Meta from "@components/Meta";
import Clocks from "@components/Clocks";
import Headline from "@components/Headline";
import Section from "@components/Section";
import NoSSR from "@components/NoSSR";
import { InfoTable } from "@components/InfoTable";
import EventTimeRow from "@components/EventTimeRow";
import Modal from "@components/Modal";
import { Button } from "@components/Button";
import { IconClose } from "@components/icons";

export default function EventPage({
  title,
  shortTitle,
  banner,
  url,
  startsAt,
  endsAt = null,
  times = [],
  description
}) {
  const [showModal, setShowModal] = useState(false);
  const { interval } = useStore(intervalStore);

  const handleModalOpen = event => {
    event.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <Meta
        title={title}
        headerTitle="Events"
        image={`/assets/events/${banner}`}
        description={`Event Timers for ${title}${
          description ? `. ${description[0].slice(0, 150)}...` : ""
        }`}
        headerDescription={`Event Timers for ${shortTitle}`}
      />
      <Clocks />
      <div className={styles.header}>
        <a
          href={url ? `https://webview.fate-go.us/${url}` : undefined}
          onClick={url ? handleModalOpen : undefined}
          target="_blank"
          rel="noreferrer noopener">
          <img src={`/assets/events/${banner}`} alt={title} />
          {url && (
            <div className={styles.hint}>
              Click to see the official News Post
            </div>
          )}
        </a>
      </div>
      <Headline>{title}</Headline>
      {description && (
        <Section background>
          {description.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </Section>
      )}
      <NoSSR>
        <InfoTable background className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th>#</th>
              <th>in</th>
              <th>at</th>
            </tr>
          </thead>
          <tbody>
            <EventTimeRow
              title={startsAt > interval ? "Starts" : "Started"}
              target={startsAt}
            />
            {endsAt !== null && (
              <EventTimeRow
                title={endsAt > interval ? "Ends" : "Ended"}
                target={endsAt}
              />
            )}
            {times.map((time, idx) => {
              // handle rotating times
              if (time.times) {
                let next = time.times.findIndex(
                  ({ startsAt }) => startsAt > interval
                );
                if (next < 0) {
                  if (time.hideWhenDone) return null;
                  next = time.times.length - 1;
                }

                return time.times
                  .slice(next)
                  .map((subTime, subIdx) => (
                    <EventTimeRow
                      key={`${idx}-${subIdx}`}
                      title={`[${time.title || "Start"}] ${subTime.title}`}
                      target={subTime.startsAt}
                    />
                  ));
              }

              // skip finished times where hideWhenDone is set
              if (
                time.hideWhenDone &&
                interval > (time.endsAt || time.startsAt)
              ) {
                return null;
              }

              const isDuration = Boolean(time.endsAt);
              const isEndTime = time.startsAt < interval;
              const title = isDuration
                ? `[${isEndTime ? "End" : "Start"}] ${time.title}`
                : time.title;

              return (
                <EventTimeRow
                  key={idx}
                  title={title}
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
        {showModal && url && (
          <Modal>
            <div className={styles.iframeWrapper}>
              <iframe src={`https://webview.fate-go.us/iframe/${url}`} />
              <Button
                className={styles.close}
                iconComponent={IconClose}
                onClick={() => setShowModal(false)}
              />
            </div>
          </Modal>
        )}
      </NoSSR>
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
  const { title, shortTitle, banner, startsAt, ...data } = await parseEventFile(
    filePath
  );
  const props = { title, shortTitle, banner, startsAt };

  if (typeof data.endsAt !== "undefined") {
    props.endsAt = data.endsAt;
  }

  if (typeof data.url !== "undefined") {
    props.url = data.url;
  }

  if (typeof data.times !== "undefined") {
    props.times = data.times;
  }

  if (typeof data.description !== "undefined") {
    props.description = data.description
      .trim()
      .replace(/\n{2,}/gm, "\n")
      .split("\n");
  }

  return { props };
}
