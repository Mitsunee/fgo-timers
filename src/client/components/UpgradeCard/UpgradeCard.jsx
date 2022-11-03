import { useStore } from "@nanostores/react";

import styles from "./UpgradeCard.module.css";
import { settingsStore } from "@stores/settingsStore";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedEstimate } from "@utils/hooks/useFormattedEstimate";
import { withSpoilerLevel } from "@utils/withSpoilerLevel";
import { Card } from "@components/Card";
import UpgradeSkill from "./UpgradeSkill";
import UpgradeNP from "./UpgradeNP";
import AtlasButton from "@components/AtlasButton";
import InlineIcon from "@components/InlineIcon";

export default function UpgradeCard({
  target,
  quest,
  servant,
  initial,
  skill,
  np
}) {
  const { showSpoiler } = useStore(settingsStore);
  const color = skill?.border || np?.border || "blue";
  const questRelease = useFormattedTimestamp(quest.open * 1000, "date");
  const questReleaseEstimate = useFormattedEstimate(quest.open * 1000);

  // Spoiler values
  const servantSpoilered = withSpoilerLevel(servant, showSpoiler, "servant");
  const cardTitle = `${servantSpoilered.name}${
    skill ? ` Skill ${skill.num}` : np ? ` NP` : ""
  }`;
  const { name: questName } = withSpoilerLevel(quest, showSpoiler, "quest");

  return (
    <Card
      // NOTE: Card shows CardHero if icon||color are set. Not setting these enabled custom stuff
      title={cardTitle}
      icon={servantSpoilered.icon}
      forceRoundIcon
      color={color}
      className={styles.card}>
      <h2>
        {questName}
        {` (${quest.type === "interlude" ? "Interlude" : "Rank Up"})`}
      </h2>
      {target === "skill" && (
        <UpgradeSkill initial={initial} skill={skill} servantId={servant.id} />
      )}
      {target === "np" && (
        <UpgradeNP initial={initial} np={np} servantId={servant.id} />
      )}
      <h3>Requires:</h3>
      <ul>
        {quest.unlock.bond > 0 && <li>Bond {quest.unlock.bond}</li>}
        {quest.unlock.ascension > 0 && (
          <li>Ascension {quest.unlock.ascension}</li>
        )}
        {quest.unlock.quest?.map(unlockQuest => {
          const { id, na } = unlockQuest;
          const { name: unlockQuestName } = withSpoilerLevel(
            unlockQuest,
            showSpoiler,
            "quest"
          );

          return (
            <li key={id}>
              {"Completed Quest: "}
              <AtlasButton link={`quest/${unlockQuest.id}/1`} na={na} inline>
                {unlockQuestName}
              </AtlasButton>
            </li>
          );
        })}
      </ul>
      <p>
        {quest.na ? (
          <>
            <b>Released:</b> {questRelease}
          </>
        ) : (
          <>
            <b>Releases:</b> {questReleaseEstimate}
          </>
        )}
      </p>
      {(target === "sq" || quest.type === "rankup") && (
        <p>
          <b>Rewards:</b>
          {" 2x "}
          <InlineIcon icon="https://static.atlasacademy.io/NA/Items/6.png" />
          {" Saint Quartz"}
        </p>
      )}
      <AtlasButton link={`quest/${quest.id}/1`} na={quest.na} inline>
        Quest Info on Atlas DB
      </AtlasButton>
      <br />
      <AtlasButton link={`servant/${servant.id}`} na={servant.na} inline>
        Servant Info on Atlas DB
      </AtlasButton>
    </Card>
  );
}
