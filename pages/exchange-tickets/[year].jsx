import { basename, extname } from "path";
import { getFileList } from "@utils/server/getFileList";
import { getItemIdMap } from "@utils/server/loginTickets/getItemIdMap";
import { getTicketFileList } from "@utils/server/loginTickets/getTicketFileList";
import { parseTicketFile } from "@utils/server/loginTickets/parseTicketFile";

import cc from "classcat";
import spacetime from "spacetime";

import styles from "@styles/LoginTicketPage.module.css";
import Meta from "@components/Meta";
import { Button } from "@components/Button";
import { IconArrow } from "@components/icons";
import CollapsableSection from "@components/CollapsableSection";
import Section from "@components/Section";
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
              {items.map(item => (
                <div key={item.id}>
                  <FGOIcon {...item} />
                  <span>{item.name}</span>
                </div>
              ))}
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
  const year = context.params.year;
  const ticketFileList = await getTicketFileList();
  const itemIdMap = await getItemIdMap();
  const { data } = await parseTicketFile(
    ticketFileList.find(path => path.includes(year)),
    itemIdMap
  );

  // fetch item data
  const res = await fetch(
    "https://api.atlasacademy.io/export/JP/nice_item_lang_en.json"
  );
  if (!res.ok) throw new Error("Error while fetch Atlas Item Data");
  const niceItem = await res.json();

  // map ids to niceItem data
  const tickets = new Array();
  for (const month in data) {
    tickets.push({
      month,
      items: data[month].map(itemId => {
        const { id, name, icon, background } = niceItem.find(
          item => item.id === itemId
        );
        return { id, name, icon, background };
      })
    });
  }

  // include list of paths in props
  const years = ticketFileList.map(path => basename(path, extname(path)));

  return { props: { tickets, years, self: year } };
}
