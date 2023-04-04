import Meta from "@components/Meta";
import { ActionButton, LinkButton } from "@components/Button";
import { IconArrow } from "@components/icons";

import styles from "src/pages/LoginTicketsPage/LoginTicketYearPage.module.css";
import type { LoginTicketYearPageProps } from "src/pages/LoginTicketsPage/static/LoginTicketYearPage";

// Next page config
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/LoginTicketsPage/static/LoginTicketYearPage";
export const config = {
  unstable_includeFiles: [
    "assets/static/login_tickets.json",
    "assets/static/data/items.json"
  ]
};

// WIP
export default function LoginTicketYearPage({
  year,
  prev,
  next
}: LoginTicketYearPageProps) {
  const prevYear = year - 1;
  const nextYear = year + 1;

  return (
    <>
      <Meta
        title={`Login Exchange Tickets ${year}`}
        description={`All Login Exchange Tickets in ${year} for Fate/Grand Order Global Version`}
      />
      <nav className={styles.nav}>
        {prev ? (
          <LinkButton
            icon={IconArrow}
            href={`/exchange-tickets/${prevYear}`}
            className={styles.left}
          />
        ) : (
          <ActionButton icon={IconArrow} className={styles.left} disabled />
        )}
        <h1>{year}</h1>
        {next ? (
          <LinkButton
            icon={IconArrow}
            href={`/exchange-tickets/${nextYear}`}
            className={styles.right}
          />
        ) : (
          <ActionButton icon={IconArrow} className={styles.right} disabled />
        )}
      </nav>
      <p>
        {/* PLACEHOLDER */}
        <b>PLACEHOLDER:</b> This page is a WIP
      </p>
    </>
  );
}
