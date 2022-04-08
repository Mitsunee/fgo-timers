//import styles from "./UpgradeNP.module.css";
import UpgradeGrid from "./UpgradeGrid";

export default function UpgradeNP({ initial, np, servantId }) {
  return (
    <UpgradeGrid
      icon={`/assets/icon_${initial.type}.png`}
      initial={initial}
      upgraded={np}
      link={`servant/${servantId}/noble-phantasms`}
    />
  );
}
