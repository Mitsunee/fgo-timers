import styles from "./LoginTicketSection.module.css";
import Section from "@components/Section";
import LoginTicketItem from "./LoginTicketItem";

export default function LoginTicketSection({ data }) {
  return (
    <Section background className={styles.section}>
      {data.map(item => (
        <LoginTicketItem key={item.id} data={item} />
      ))}
    </Section>
  );
}
