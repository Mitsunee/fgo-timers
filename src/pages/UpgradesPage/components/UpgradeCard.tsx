import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import {
  Upgrade,
  upgradeIsNPUpgrade,
  upgradeIsSkillUpgrade,
  UpgradeMapNP,
  UpgradeMapSkill,
  UpgradeQuestType
} from "src/upgrades/types";
import styles from "./UpgradeCard.module.css";
import { Hero } from "./Hero";
import { BorderColours, Borders } from "src/types/borders";
import { NPUpgrade, SkillUpgrade } from "./UpgradeDisplay";
import { Highlight } from "../types";
import { Subtitle, Title } from "./Title";
import type { MappedBundledQuest } from "../mapQuestUnlocks";
import { UpgradeInfo } from "./UpgradeInfo";

type PropsBase = {
  servant: BundledServant;
  quest: MappedBundledQuest;
  // TODO: prop to override NA props where applicable (not in quest)
} & Highlight;
type WithSkillUpgrade = {
  upgrade: Upgrade & { upgrades: UpgradeMapSkill };
  from: BundledSkill;
  to: BundledSkill;
};
type WithNPUpgrade = {
  upgrade: Upgrade & { upgrades: UpgradeMapNP };
  from: BundledNP;
  to: BundledNP;
};
type WithSQIntld = {
  upgrade: Upgrade & { upgrades?: undefined };
  from?: undefined;
  to?: undefined;
};
type UpgradeCardProps = PropsBase &
  (WithSkillUpgrade | WithNPUpgrade | WithSQIntld);

function isSkillUpgrade(
  props: UpgradeCardProps
): props is PropsBase & WithSkillUpgrade {
  return upgradeIsSkillUpgrade(props.upgrade);
}

function isNPUpgrade(
  props: UpgradeCardProps
): props is PropsBase & WithNPUpgrade {
  return upgradeIsNPUpgrade(props.upgrade);
}

export function UpgradeCard(props: UpgradeCardProps) {
  const { servant, quest } = props;
  const questPrefix =
    quest.type === UpgradeQuestType.INTERLUDE
      ? "Interlude"
      : quest.na
      ? ""
      : "Rank Up";
  const highlight: Highlight = props.match
    ? { match: props.match, index: props.index, length: props.length }
    : {};

  // set SQ Interlude Properties as default
  let suffix = "";
  let subtitleIcon: Parameters<typeof Subtitle>[0]["icon"] = "sq";
  let UpgradeDisplay: null | React.ReactNode = null;
  let border: Borders = Borders.BLUE;

  // handle Skill Upgrade Properties
  if (isSkillUpgrade(props)) {
    suffix = `Skill ${props.to.num}`;
    subtitleIcon = "skill";
    border = props.to.border;
    UpgradeDisplay = (
      <SkillUpgrade upgrade={props.upgrade} from={props.from} to={props.to} />
    );
  }
  // handle NP Upgrade Properties
  else if (isNPUpgrade(props)) {
    suffix = "NP";
    subtitleIcon = "np";
    border = props.to.border;
    UpgradeDisplay = (
      <NPUpgrade upgrade={props.upgrade} from={props.from} to={props.to} />
    );
  }

  return (
    <article
      className={styles.card}
      style={{ "--border": BorderColours[border] } as React.CSSProperties}>
      <Hero
        border={border}
        id={props.upgrade.servant}
        name={servant.name}
        icon={servant.icon}
        na={servant.na}
      />
      <Title
        id={props.upgrade.servant}
        servant={servant}
        suffix={suffix}
        {...highlight}
      />
      <Subtitle
        icon={subtitleIcon}
        prefix={questPrefix}
        name={quest.name}
        {...highlight}
      />
      {UpgradeDisplay}
      <UpgradeInfo
        quest={quest}
        questId={props.upgrade.quest}
        servant={servant}
        servantId={props.upgrade.servant}
      />
    </article>
  );
}
