import Image from "next/image";
import styles from "./EventHero.module.css";

interface EventHeroProps {
  banner: string;
  title: string;
}

export function EventHero({ banner, title }: EventHeroProps) {
  return (
    <div className={styles.wrapper}>
      <Image
        src={`/assets/events/${banner}`}
        alt={title}
        width={800}
        height={300}
        priority
      />
    </div>
  );
}
