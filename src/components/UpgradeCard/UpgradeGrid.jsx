import styles from "./UpgradeGrid.module.css";
import FGOIcon from "@components/FGOIcon";
import { IconArrow } from "@components/icons";
import AtlasButton from "@components/AtlasButton";

export default function UpgradeGrid({ icon = false, initial, upgraded, link }) {
  return (
    <div className={styles.grid}>
      <div>
        <FGOIcon
          icon={icon || initial.icon}
          background={initial.border ?? "black"}
          name={initial.name}
          className={styles.icon}
        />
      </div>
      <div>
        <IconArrow className={styles.arrow} />
      </div>
      <div>
        <FGOIcon
          icon={icon || upgraded.icon}
          background={upgraded.border ?? "black"}
          name={upgraded.name}
          className={styles.icon}
        />
      </div>
      <div>
        {
          // this is possibly `null` for quests that add a new 3rd skill
          initial.name && (
            <AtlasButton link={link} na={initial.na} inline>
              {initial.name}
            </AtlasButton>
          )
        }
      </div>
      <div />
      <div>
        <AtlasButton link={link} na={upgraded.na} inline>
          {upgraded.name}
        </AtlasButton>
      </div>
    </div>
  );
}
