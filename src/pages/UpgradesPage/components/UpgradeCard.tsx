import {
  useNPMap,
  useQuestMap,
  useServantMap,
  useSkillMap
} from "~/client/contexts";
import { Card, CardHero } from "~/components/Card";
import { nameServantClass } from "~/servants/classNames";
import { getSkillNum } from "~/servants/getSkillNum";
import { Borders } from "~/types/borders";
import { UpgradeQuestType } from "~/upgrades/types";
import type {
  BundledUpgrade,
  UpgradeMapNP,
  UpgradeMapSkill
} from "~/upgrades/types";
import { createQuestUnlockMapper } from "../mapQuestUnlocks";
import type { Highlight } from "../types";
import { Subtitle, Title } from "./Title";
import { NPUpgrade, SkillUpgrade } from "./UpgradeDisplay";
import { UpgradeInfo } from "./UpgradeInfo";
import styles from "./UpgradeCard.module.css";

type UpgradeCardProps = Highlight & {
  upgrade: BundledUpgrade;
  bypassSpoilers?: true;
};

function isSkillUpgrade(
  upgrade: BundledUpgrade
): upgrade is BundledUpgrade & { upgrades: UpgradeMapSkill } {
  return upgrade.upgrades?.type == "skill";
}
function isNPUpgrade(
  upgrade: BundledUpgrade
): upgrade is BundledUpgrade & { upgrades: UpgradeMapNP } {
  return upgrade.upgrades?.type == "np";
}

export function UpgradeCard({
  upgrade,
  bypassSpoilers,
  ...highlight
}: UpgradeCardProps) {
  const servantMap = useServantMap();
  const skillMap = useSkillMap();
  const npMap = useNPMap();
  const questMap = useQuestMap();
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
  if (isSkillUpgrade(upgrade)) {
    const to = skillMap[upgrade.upgrades.newId];
    const toNum = getSkillNum(to, upgrade.servant);
    suffix = `Skill ${toNum}`;
    subtitleIcon = "skill";
    border = to.border;
    UpgradeDisplay = (
      <SkillUpgrade upgrade={upgrade} bypassSpoilers={bypassSpoilers} />
    );
  }

  // handle NP upgrade props
  else if (isNPUpgrade(upgrade)) {
    const to = npMap[upgrade.upgrades.newId];
    suffix = "NP";
    subtitleIcon = "np";
    border = to.border;
    UpgradeDisplay = (
      <NPUpgrade upgrade={upgrade} bypassSpoilers={bypassSpoilers} />
    );
  }

  return (
    <Card color={border} className={styles.card}>
      <CardHero
        iconId={upgrade.servant}
        title={servant.name}
        icon={servant.icon}
        placeholder={placeholder}
        bypassSpoilers={servant.na ?? bypassSpoilers}
        forceRound
      />
      <main>
        <Title
          id={upgrade.servant}
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
          servantId={upgrade.servant}
        />
      </main>
    </Card>
  );
}
