import { useState } from "react";
import { useStore } from "@nanostores/react";

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

export { getStaticPaths, getStaticProps } from "@server/EventPage";
export const config = {
  unstable_includeFiles: ["assets/static/events.json"]
};

export default function EventPage({
  title,
  shortTitle,
  banner,
  url,
  start,
  end = null,
  times = [],
  description
}) {
  const [showModal, setShowModal] = useState(false);
  const { seconds: interval } = useStore(intervalStore);
  //console.log(interval);

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
        description={
          description
            ? description[0].length > 250
              ? `${description[0].slice(0, 250)}...`
              : description[0]
            : `Event Timers for ${title}`
        }
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
              title={start > interval ? "Starts" : "Started"}
              target={start}
            />
            {end !== null && (
              <EventTimeRow
                title={end > interval ? "Ends" : "Ended"}
                target={end}
              />
            )}
            {times.map((time, idx) => {
              // handle rotating times
              if (time.times) {
                let next = time.times.findIndex(({ date }) => date > interval);
                if (next > 0) {
                  // if it found a future item also show current item
                  // (presumably previous item?)
                  next--;
                } else if (next < 0) {
                  // if all items are past then only show last
                  if (time.hide) return null;
                  next = time.times.length - 1;
                }

                return time.times
                  .slice(next)
                  .map((subTime, subIdx) => (
                    <EventTimeRow
                      key={`${idx}-${subIdx}`}
                      title={`[${time.title || "Start"}] ${subTime.title}`}
                      target={subTime.date}
                    />
                  ));
              }

              // skip finished times where hide is set
              if (time.hide && interval > (time.end || time.start)) {
                return null;
              }

              const isDuration = Boolean(time.end);
              const isEndTime = time.start < interval;
              const title = isDuration
                ? `[${isEndTime ? "End" : "Start"}] ${time.title}`
                : time.title;

              return (
                <EventTimeRow
                  key={idx}
                  title={title}
                  target={
                    time.start > interval ? time.start : time.end || time.start
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
