import { createContext, useContext } from "react";
import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import { nameServantClass } from "src/servants/classNames";
import { Borders } from "src/types/borders";
import type { BundledQuest, BundledUpgrade } from "src/upgrades/types";
import { UpgradeQuestType } from "src/upgrades/types";
import { Card, CardHero } from "src/client/components/Card";
import { createQuestUnlockMapper } from "../mapQuestUnlocks";
import type { Highlight } from "../types";
import { NPUpgrade, SkillUpgrade } from "./UpgradeDisplay";
import { Subtitle, Title } from "./Title";
import { UpgradeInfo } from "./UpgradeInfo";
import styles from "./UpgradeCard.module.css";

type UpgradeContext = {
  servantMap: Record<number, BundledServant>;
  skillMap: Record<number, BundledSkill>;
  npMap: Record<number, BundledNP>;
  questMap: Record<number, BundledQuest>;
};

type UpgradeCardProps = Highlight & {
  upgrade: BundledUpgrade;
  bypassSpoilers?: true;
};

const context = createContext<UpgradeContext>({
  servantMap: {},
  skillMap: {},
  npMap: {},
  questMap: {}
});
export const UpgradeContextProvider = context.Provider;

export function UpgradeCard({
  upgrade,
  bypassSpoilers,
  ...highlight
}: UpgradeCardProps) {
  const { servantMap, skillMap, npMap, questMap } = useContext(context);
  const questMapper = createQuestUnlockMapper(questMap);
  const quest = questMapper(upgrade.quest);
  const servant = servantMap[upgrade.servant];
  const placeholder = `${servant.rarity}* ${nameServantClass(servant.classId)}`;
  const prefix =
    quest.type === UpgradeQuestType.INTERLUDE
      ? "Interlude"
      : quest.na
      ? ""
      : "Rank Up";

  // set SQ Interlude props by default
  let suffix = "";
  let subtitleIcon: React.ComponentProps<typeof Subtitle>["icon"] = "sq";
  let UpgradeDisplay: null | React.ReactNode = null;
  let border: Borders = Borders.BLUE;

  // handle Skill upgrade props
  if (upgrade.upgrades?.type == "skill") {
    const from = skillMap[upgrade.upgrades.id ?? 0];
    const to = skillMap[upgrade.upgrades.newId];
    suffix = `Skill ${to.num}`;
    subtitleIcon = "skill";
    border = to.border;
    UpgradeDisplay = (
      <SkillUpgrade upgrade={upgrade as any} from={from} to={to} />
    );
  }

  // handle NP upgrade props
  else if (upgrade.upgrades?.type == "np") {
    const from = npMap[upgrade.upgrades.id];
    const to = npMap[upgrade.upgrades.newId];
    suffix = "NP";
    subtitleIcon = "np";
    border = to.border;
    UpgradeDisplay = <NPUpgrade upgrade={upgrade as any} from={from} to={to} />;
  }

  return (
    <Card color={border} className={styles.card}>
      <CardHero
        id={upgrade.servant}
        title={servant.name}
        icon={servant.icon}
        placeholder={placeholder}
        bypassSpoilers={servant.na ?? bypassSpoilers}
        forceRound
      />
      <main>
        <Title
          id={upgrade.servant}
          name={servant.name}
          na={servant.na}
          placeholder={placeholder}
          suffix={suffix}
          {...highlight}
        />
        <Subtitle
          icon={subtitleIcon}
          prefix={prefix}
          name={quest.name}
          {...highlight}
        />
        {UpgradeDisplay}
        <UpgradeInfo
          quest={quest}
          questId={upgrade.quest}
          servant={servant}
          servantId={upgrade.servant}
        />
      </main>
    </Card>
  );
}
