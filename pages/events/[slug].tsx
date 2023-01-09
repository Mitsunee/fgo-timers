import Meta from "src/client/components/Meta";
import { Clocks } from "src/client/components/Clocks";
import Headline from "src/client/components/Headline";
import type { EventPageProps } from "src/pages/EventPage/getStaticProps";
// import styles from "src/pages/EventPage/styles.module.css";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/EventPage/getStaticProps";
export const config = {
  unstable_includeFiles: [
    "assets/static/events.json",
    "assets/static/data/servants.json",
    "assets/static/data/ces.json"
  ]
};

export default function EventPage({
  event /*,
  servants,
  ces */
}: EventPageProps) {
  const metaDesc = event.description.split("\n")[0];

  return (
    <>
      <Meta
        title={event.title}
        headerTitle="Events"
        image={`/assets/events/${event.banner}`}
        description={
          metaDesc.length > 250 ? `${metaDesc.slice(0, 250)}...` : metaDesc
        }
        headerDescription={`Event Timers for ${event.shortTitle}`}
      />
      <Clocks />
      {/* PLACEHOLDER */}
      <Headline>PLACEHOLDER</Headline>
      {/* DEBUG */}
      <pre>
        <code>{JSON.stringify(event, null, 2)}</code>
      </pre>
    </>
  );
}
