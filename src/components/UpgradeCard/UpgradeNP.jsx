//import styles from "./UpgradeNP.module.css";
import UpgradeGrid from "./UpgradeGrid";

export default function UpgradeNP({ initial, np }) {
  // TODO: link generation

  return (
    <UpgradeGrid
      leftIcon={`/assets/icon_${initial.type}.png`}
      leftName={initial.name}
      leftColor={initial.border}
      rightIcon={`/assets/icon_${np.type}.png`}
      rightName={np.name}
      rightColor={np.border}
    />
  );
}
