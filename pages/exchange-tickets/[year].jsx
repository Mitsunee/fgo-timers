import { basename, extname } from "path";
import { getFileList } from "@utils/server/getFileList";
import { getItemIdMap } from "@utils/server/loginTickets/getItemIdMap";
import { parseJsonFile } from "@utils/server/parseJsonFile";
import { getTicketFileList } from "@utils/server/loginTickets/getTicketFileList";
import { parseTicketFile } from "@utils/server/loginTickets/parseTicketFile";

import { useStore } from "@nanostores/react";
import spacetime from "spacetime";
import cc from "classcat";

import styles from "@styles/LoginTicketPage.module.css";
import { settingsStore } from "@stores/settingsStore";
import { withSpoilerLevel } from "@utils/withSpoilerLevel";
import Meta from "@components/Meta";
import { Button } from "@components/Button";
import { IconArrow } from "@components/icons";
import CollapsableSection from "@components/CollapsableSection";
import Section from "@components/Section";
import NoSSR from "@components/NoSSR";
import FGOIcon from "@components/FGOIcon";

const monthName = new Map([
  ["Jan", "January"],
  ["Feb", "February"],
  ["Mar", "March"],
  ["Apr", "April"],
  ["May", "May"],
  ["Jun", "June"],
  ["Jul", "July"],
  ["Aug", "August"],
  ["Sept", "September"],
  ["Oct", "October"],
  ["Nov", "November"],
  ["Dec", "December"]
]);

export default function LoginTicketPage({ tickets, years, self }) {
  const { showSpoiler } = useStore(settingsStore);
  const prev = `${+self - 1}`;
  const hasPrev = years.includes(prev);
  const next = `${+self + 1}`;
  const hasNext = years.includes(next);
  const s = spacetime.now();
  const showDisclaimer = s.year() <= self;

  return (
    <>
      <Meta
        title={`Login Exchange Tickets ${self}`}
        description={`All Login Exchange Tickets in ${self} for Fate/Grand Order NA`}
      />
      <div className={styles.navWrapper}>
        <Button
          iconComponent={IconArrow}
          className={cc([styles.button, styles.left])}
          href={hasPrev ? `/exchange-tickets/${prev}` : undefined}
          disabled={!hasPrev}
          nextLink
        />
        <h1>{self}</h1>
        <Button
          iconComponent={IconArrow}
          className={cc([styles.button, styles.right])}
          href={hasNext ? `/exchange-tickets/${next}` : undefined}
          disabled={!hasNext}
          nextLink
        />
      </div>
      {showDisclaimer && (
        <CollapsableSection background closeable>
          <p>
            <b>Note:</b> All future Exchange Tickets are speculation based on
            the JP version.
          </p>
        </CollapsableSection>
      )}
      <div className={styles.wrapper}>
        {tickets.map(({ month, items }) => (
          <article key={month}>
            <h1>{monthName.get(month)}</h1>
            <Section background="blue" className={styles.section}>
              <NoSSR>
                {items.map(item => {
                  const itemSpoilered = withSpoilerLevel(
                    item,
                    showSpoiler,
                    "item"
                  );

                  return (
                    <div key={item.id}>
                      <FGOIcon {...itemSpoilered} />
                      <span>{itemSpoilered.name}</span>
                    </div>
                  );
                })}
              </NoSSR>
            </Section>
          </article>
        ))}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const fileList = await getFileList("assets/data/login-tickets");
  const paths = fileList.map(file => ({
    params: {
      year: basename(file, extname(file))
    }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps(context) {
  // read ticket file
  const year = context.params.year;
  const ticketFileList = await getTicketFileList();
  const itemIdMap = await getItemIdMap();
  const niceItem = await parseJsonFile("cache/JP/nice_item_lang_en.json");
  const niceItemNA = await parseJsonFile("cache/NA/nice_item.json");

  // parse ticket data
  const { data } = await parseTicketFile(
    ticketFileList.find(path => path.includes(year)),
    itemIdMap
  );
  const tickets = new Array();
  for (const month in data) {
    tickets.push({
      month,
      items: data[month].map(itemId => {
        // check JP for the item and get data
        const { id, name, icon, background } = niceItem.find(
          item => item.id === itemId
        );
        const item = { id, name, icon, background };

        // check NA for the item
        if (niceItemNA.findIndex(item => item.id === itemId) >= 0)
          item.na = true;

        return item;
      })
    });
  }

  // include list of paths in props
  const years = ticketFileList.map(path => basename(path, extname(path)));

  return { props: { tickets, years, self: year } };
}
