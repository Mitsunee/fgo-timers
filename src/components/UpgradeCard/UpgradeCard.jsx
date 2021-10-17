import styles from "./UpgradeCard.module.css";
import { borderColors, backgroundColors } from "@styles/fgoIconTheme";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedEstimate } from "@utils/hooks/useFormattedEstimate";
import { Card } from "@components/Card";
import UpgradeSkill from "./UpgradeSkill";
import UpgradeNP from "./UpgradeNP";
import InlineIcon from "@components/InlineIcon";

export default function UpgradeCard({
  target,
  quest,
  servant,
  initial,
  skill,
  np
}) {
  const color = skill?.border || np?.border || "blue";
  const background = backgroundColors.get(color);
  const border = borderColors.get(color);
  const questRelease = useFormattedTimestamp(quest.open * 1000, "date");
  const questReleaseEstimate = useFormattedEstimate(quest.open * 1000);

  return (
    <Card
      title={`${servant.name}${
        skill ? ` Skill ${skill.num}` : np ? ` NP` : ""
      }`}
      icon={servant.icon}
      forceRoundIcon
      border={border}
      background={background}
      className={styles.card}>
      <h2>
        {quest.name} ({quest.type === "interlude" ? "Interlude" : "Rank Up"})
      </h2>
      {/* WIP: upgrade display */}
      {target === "skill" && <UpgradeSkill initial={initial} skill={skill} />}
      {target === "np" && <UpgradeNP initial={initial} np={np} />}
      <h3>Requires:</h3>
      <ul>
        {quest.unlock.bond > 0 && <li>Bond {quest.unlock.bond}</li>}
        {quest.unlock.ascension > 0 && (
          <li>Ascension {quest.unlock.ascension}</li>
        )}
        {quest.unlock.quest && (
          <li>
            Completed Quest
            {
              // TODO: Atlas DB button
              ` “${quest.unlock.quest.name}”`
            }
          </li>
        )}
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
          <b>Rewards:</b> 2x{" "}
          <InlineIcon icon="https://static.atlasacademy.io/JP/Items/6.png" />{" "}
          Saint Quartz
        </p>
      )}
    </Card>
  );
}
