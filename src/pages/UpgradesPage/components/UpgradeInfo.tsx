import { InlineSvg } from "src/client/components/InlineIcon";
import { IconAtlas } from "src/client/components/icons";
import type { BundledServant } from "src/servants/types";
import type { MappedBundledQuest } from "../mapQuestUnlocks";
import { DisplayDate, DisplayDateEstimate } from "@components/TimeDisplay";

interface UpgradeInfoProps {
  quest: MappedBundledQuest;
  questId: number;
  servant: BundledServant;
  servantId: number;
}

export function UpgradeInfo({
  quest,
  questId,
  servant,
  servantId
}: UpgradeInfoProps) {
  const time = quest.open * 1000;
  return (
    <section>
      {quest.unlock && (
        <>
          <b>Requires:</b>
          <ul>
            {quest.unlock.bond && quest.unlock.bond > 0 && (
              <li key="bond">Bond {quest.unlock.bond}</li>
            )}
            {quest.unlock.asc && quest.unlock.asc > 0 && (
              <li key="asc">Ascension {quest.unlock.asc}</li>
            )}
            {quest.unlock.quests?.map(requiredQuest => (
              <li key={requiredQuest.id}>
                Completed Quest:{" "}
                <a
                  href={`https://apps.atlasacademy.io/db/${
                    requiredQuest.na ? "NA" : "JP"
                  }/quest/${requiredQuest.id}/1`}>
                  {requiredQuest.name} <InlineSvg icon={IconAtlas} />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        <b>Release{quest.na ? "d" : "s"}:</b>{" "}
        {quest.na ? (
          <DisplayDate time={time} format="date" serverTz="always" />
        ) : (
          <DisplayDateEstimate time={time} />
        )}
        <br />
        <a
          href={`https://apps.atlasacademy.io/db/${
            quest.na ? "NA" : "JP"
          }/quest/${questId}/1`}>
          Quest Info on Atlas Academy DB <InlineSvg icon={IconAtlas} />
        </a>
        <br />
        <a
          href={`https://apps.atlasacademy.io/db/${
            servant.na ? "NA" : "JP"
          }/servant/${servantId}/1`}>
          Servant Info on Atlas Academy DB <InlineSvg icon={IconAtlas} />
        </a>
      </p>
    </section>
  );
}
