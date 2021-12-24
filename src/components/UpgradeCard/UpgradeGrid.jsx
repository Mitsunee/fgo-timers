import { useStore } from "@nanostores/react";

import styles from "./UpgradeGrid.module.css";
import { settingsStore } from "@stores/settingsStore";
import { withSpoilerLevel } from "@utils/withSpoilerLevel";
import FGOIcon from "@components/FGOIcon";
import { IconArrow } from "@components/icons";
import AtlasButton from "@components/AtlasButton";

export default function UpgradeGrid({ icon = false, initial, upgraded, link }) {
  const { showSpoiler } = useStore(settingsStore);
  const initialSpoilered = withSpoilerLevel(
    initial,
    showSpoiler,
    initial.num ? "skill" : "np"
  );
  const upgradedSpoilered = withSpoilerLevel(
    upgraded,
    showSpoiler,
    upgraded.num ? "skill" : "np"
  );

  return (
    <div className={styles.grid}>
      <div>
        <FGOIcon
          icon={icon || initialSpoilered.icon}
          background={initial.border ?? "black"}
          name={initialSpoilered.name}
          className={styles.icon}
        />
      </div>
      <div>
        <IconArrow className={styles.arrow} />
      </div>
      <div>
        <FGOIcon
          icon={icon || upgradedSpoilered.icon}
          background={upgraded.border ?? "black"}
          name={upgradedSpoilered.name}
          className={styles.icon}
        />
      </div>
      <div>
        {
          // this is possibly `null` for quests that add a new 3rd skill
          initial.name && (
            <AtlasButton link={link} na={initial.na} inline>
              {initialSpoilered.name}
            </AtlasButton>
          )
        }
      </div>
      <div />
      <div>
        <AtlasButton link={link} na={upgraded.na} inline>
          {upgradedSpoilered.name}
        </AtlasButton>
      </div>
    </div>
  );
}
