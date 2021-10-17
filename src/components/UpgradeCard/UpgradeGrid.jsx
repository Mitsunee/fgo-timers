import styles from "./UpgradeGrid.module.css";
import FGOIcon from "@components/FGOIcon";
import { IconArrow } from "@components/icons";

export default function UpgradeGrid({
  leftIcon,
  leftColor,
  leftName,
  //leftLink,
  rightIcon,
  rightColor,
  rightName
  //rightLink
}) {
  // TODO: atlas db buttons

  return (
    <div className={styles.grid}>
      <div>
        <FGOIcon
          icon={leftIcon}
          background={leftColor}
          name={leftName}
          className={styles.icon}
        />
      </div>
      <div>
        <IconArrow className={styles.arrow} />
      </div>
      <div>
        <FGOIcon
          icon={rightIcon}
          background={rightColor}
          name={rightName}
          className={styles.icon}
        />
      </div>
      <div>
        {
          // this is possibly `null` for quests that add a new 3rd skill
          leftName
        }
      </div>
      <div />
      <div>{rightName}</div>
    </div>
  );
}
