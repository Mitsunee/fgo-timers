import { useStore } from "@nanostores/react";

import styles from "./UpgradeGrid.module.css";
import { settingsStore } from "@stores/settingsStore";
import FGOIcon from "@components/FGOIcon";
import { IconArrow } from "@components/icons";
import AtlasButton from "@components/AtlasButton";

const spoilerSkillIcon =
  "https://static.atlasacademy.io/NA/SkillIcons/skill_999999.png";

export default function UpgradeGrid({ icon = false, initial, upgraded, link }) {
  const { showSpoiler } = useStore(settingsStore);
  const initialName =
    initial.na || showSpoiler !== "strict"
      ? initial.name
      : initial.num
      ? `Skill ${initial.num}`
      : `Noble Phantasm`;
  const upgradedName =
    upgraded.na || showSpoiler !== "strict"
      ? upgraded.name
      : upgraded.num
      ? `Skill ${upgraded.num}`
      : `Noble Phantasm`;

  return (
    <div className={styles.grid}>
      <div>
        <FGOIcon
          icon={
            initial.na || showSpoiler === "all"
              ? icon || initial.icon
              : spoilerSkillIcon
          }
          background={initial.border ?? "black"}
          name={initialName}
          className={styles.icon}
        />
      </div>
      <div>
        <IconArrow className={styles.arrow} />
      </div>
      <div>
        <FGOIcon
          icon={
            upgraded.na || showSpoiler === "all"
              ? icon || upgraded.icon
              : spoilerSkillIcon
          }
          background={upgraded.border ?? "black"}
          name={upgradedName}
          className={styles.icon}
        />
      </div>
      <div>
        {
          // this is possibly `null` for quests that add a new 3rd skill
          initial.name && (
            <AtlasButton link={link} na={initial.na} inline>
              {initialName}
            </AtlasButton>
          )
        }
      </div>
      <div />
      <div>
        <AtlasButton link={link} na={upgraded.na} inline>
          {upgradedName}
        </AtlasButton>
      </div>
    </div>
  );
}
