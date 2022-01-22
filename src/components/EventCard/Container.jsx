import { forwardRef } from "react";

import styles from "./Container.module.css";

const Container = forwardRef(
  ({ children, title, banner, slug, onClick, href }, ref) => {
    return (
      <a
        href={href}
        className={styles.card}
        title={title}
        onClick={onClick}
        ref={ref}>
        <img src={`/assets/events/${banner}`} alt={slug} />
        {children}
      </a>
    );
  }
);
Container.displayName = "EventCard_Container";

export default Container;
