import { AtlasLink } from "~/client/components/AtlasLink";
import {
  DisplayDate,
  DisplayDateEstimate
} from "~/client/components/TimeDisplay";
import { useServantMap } from "~/client/contexts";
import { useCurrentTime } from "~/client/utils/hooks/useCurrentTime";
import { useIsClient } from "~/client/utils/hooks/useIsClient";
import type { MappedBundledQuest } from "../mapQuestUnlocks";

interface UpgradeInfoProps {
  quest: MappedBundledQuest;
  questId: number;
  servantId: number;
}

export function UpgradeInfo({ quest, questId, servantId }: UpgradeInfoProps) {
  const servantMap = useServantMap();
  const isClient = useIsClient();
  const { current } = useCurrentTime();
  const servant = servantMap[servantId];

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
                <AtlasLink
                  link={`quest/${requiredQuest.id}/1`}
                  na={requiredQuest.na}
                  targetBlank>
                  {requiredQuest.name}
                </AtlasLink>
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        <b>Release{isClient && current >= quest.open ? "d" : "s"}:</b>{" "}
        {quest.estimate ? (
          <DisplayDateEstimate time={quest.open} />
        ) : (
          <DisplayDate time={quest.open} format="date" serverTz="ssr" />
        )}
        <br />
        <AtlasLink link={`quest/${questId}/1`} na={quest.na} targetBlank>
          Quest Info on Atlas Academy DB
        </AtlasLink>
        <br />
        <AtlasLink link={`servant/${servantId}`} na={servant.na} targetBlank>
          Servant Info on Atlas Academy DB
        </AtlasLink>
      </p>
    </section>
  );
}
