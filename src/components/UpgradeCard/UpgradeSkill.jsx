//import styles from "./UpgradeSkill.module.css";
import UpgradeGrid from "./UpgradeGrid";

export default function UpgradeSkill({ initial, skill }) {
  // TODO: link generation

  return (
    <UpgradeGrid
      leftIcon={initial.icon}
      leftName={initial.name}
      leftColor={initial.border ?? "black"}
      rightIcon={skill.icon}
      rightName={skill.name}
      rightColor={skill.border ?? "black"}
    />
  );
}
