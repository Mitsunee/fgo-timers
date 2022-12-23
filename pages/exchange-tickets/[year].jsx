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

export { getStaticPaths, getStaticProps } from "@server/LoginTicketPage";
export const config = {
  unstable_includeFiles: ["assets/static/loginTickets.json"]
};

const monthName = new Map([
  ["Jan", "January"],
  ["Feb", "February"],
  ["Mar", "March"],
  ["Apr", "April"],
  ["May", "May"],
  ["Jun", "June"],
  ["Jul", "July"],
  ["Aug", "August"],
  ["Sep", "September"],
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
      {self >= 2024 && (
        <CollapsableSection background closeable>
          <p>
            <b>Note:</b> As of September 2022 the tickets on the JP version have
            had more than 3 items. This is currently not supported in the layout
            of this page. Future tickets will thus not be updated until I can
            rewrite this page to accomodate for this change. Thanks for
            understanding.
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
                    {
                      ...item,
                      icon: `https://static.atlasacademy.io/${item.icon}`
                    },
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
