import { useContext } from "react";
import { useStore } from "@nanostores/react";
import { intervalStore } from "src/client/stores/intervalStore";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { AtlasLink } from "src/client/components/AtlasLink";
import {
  DisplayDate,
  DisplayDateEstimate
} from "src/client/components/TimeDisplay";
import type { MappedBundledQuest } from "../mapQuestUnlocks";
import { context } from "./context";

interface UpgradeInfoProps {
  quest: MappedBundledQuest;
  questId: number;
  servantId: number;
}

export function UpgradeInfo({ quest, questId, servantId }: UpgradeInfoProps) {
  const { servantMap } = useContext(context);
  const isClient = useIsClient();
  const { seconds: current } = useStore(intervalStore);
  const servant = servantMap[servantId];
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
          <DisplayDateEstimate time={time} />
        ) : (
          <DisplayDate time={time} format="date" serverTz="ssr" />
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
