import { Availability } from "src/types/enum";
import styles from "./BorderedIconAvailability.module.css";

interface BorderedIconAvailabilityProps {
  availability?: Availability;
}

const basePath = "/assets/availability";

function getIconPath(
  availability?: Availability
): { path: string; alt: string } | null {
  switch (availability) {
    case Availability.LIMITED:
      return { path: `${basePath}/limited.png`, alt: "Limited Time Rateup" };
    case Availability.STORYLOCKED:
      return { path: `${basePath}/locked.png`, alt: "Storylocked Pool" };
    case Availability.WELFARE:
      return { path: `${basePath}/welfare.png`, alt: "Event Gift" };
    case Availability.FP_POOL:
      return { path: `${basePath}/fp_pool.png`, alt: "Friend Point Pool" };
    case Availability.FP_LIMITED:
      return {
        path: `${basePath}/fp_lim.png`,
        alt: "Limited Time Friend Point Pool"
      };
    case Availability.FP_LOCKED:
      return {
        path: `${basePath}/fp_lock.png`,
        alt: "Storylocked Friend Point Pool"
      };
    default:
      return null;
  }
}

export function BorderedIconAvailability({
  availability
}: BorderedIconAvailabilityProps) {
  const icon = getIconPath(availability);

  if (!icon) return null;

  return (
    <img
      src={icon.path}
      className={styles.icon}
      alt={icon.alt}
      title={icon.alt}
    />
  );
}
