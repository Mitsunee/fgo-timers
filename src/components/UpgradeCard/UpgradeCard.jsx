import styles from "./UpgradeCard.module.css";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedEstimate } from "@utils/hooks/useFormattedEstimate";
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
  const color = skill?.border || np?.border || "blue";
  const questRelease = useFormattedTimestamp(quest.open * 1000, "date");
  const questReleaseEstimate = useFormattedEstimate(quest.open * 1000);

  return (
    <Card
      title={`${servant.name}${
        skill ? ` Skill ${skill.num}` : np ? ` NP` : ""
      }`}
      icon={servant.icon}
      forceRoundIcon
      color={color}
      className={styles.card}>
      <h2>
        {quest.name} ({quest.type === "interlude" ? "Interlude" : "Rank Up"})
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
        {quest.unlock.quest?.map(({ id, name, na }) => (
          <li key={id}>
            {"Completed Quest: "}
            <AtlasButton
              link={`quest/${id}/1`}
              na={na}
              inline>{`“${name}”`}</AtlasButton>
          </li>
        ))}
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
          <InlineIcon icon="https://static.atlasacademy.io/NA/Items/6.png" />{" "}
          Saint Quartz
        </p>
      )}
      <AtlasButton link={`servant/${servant.id}`} na={servant.na} inline>
        Servant Info on Atlas DB
      </AtlasButton>
    </Card>
  );
}
