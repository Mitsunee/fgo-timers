//import styles from "./UpgradeSkill.module.css";
import UpgradeGrid from "./UpgradeGrid";

export default function UpgradeSkill({ initial, skill, servantId }) {
  return (
    <UpgradeGrid
      initial={initial}
      upgraded={skill}
      link={`servant/${servantId}/skill-${skill.num}`}
    />
  );
}
