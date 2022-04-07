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

export { getStaticPaths, getStaticProps } from "src/server/EventPage";
export const config = {
  unstable_includeFiles: ["assets/static/events.json"]
};

export default function EventPage({
  title,
  shortTitle,
  banner,
  url,
  starts,
  ends = null,
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
        description={
          description
            ? `${description[0].slice(0, 250)}...`
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
              title={starts > interval ? "Starts" : "Started"}
              target={starts}
            />
            {ends !== null && (
              <EventTimeRow
                title={ends > interval ? "Ends" : "Ended"}
                target={ends}
              />
            )}
            {times.map((time, idx) => {
              // handle rotating times
              if (time.times) {
                let next = time.times.findIndex(
                  ({ starts }) => starts > interval
                );
                if (next < 0) {
                  if (time.hide) return null;
                  next = time.times.length - 1;
                }

                return time.times
                  .slice(next)
                  .map((subTime, subIdx) => (
                    <EventTimeRow
                      key={`${idx}-${subIdx}`}
                      title={`[${time.title || "Start"}] ${subTime.title}`}
                      target={subTime.starts}
                    />
                  ));
              }

              // skip finished times where hide is set
              if (time.hide && interval > (time.ends || time.starts)) {
                return null;
              }

              const isDuration = Boolean(time.ends);
              const isEndTime = time.starts < interval;
              const title = isDuration
                ? `[${isEndTime ? "End" : "Start"}] ${time.title}`
                : time.title;

              return (
                <EventTimeRow
                  key={idx}
                  title={title}
                  target={
                    time.starts > interval
                      ? time.starts
                      : time.ends || time.starts
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
