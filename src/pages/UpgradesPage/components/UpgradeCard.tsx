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

  if (isSkillUpgrade(props)) {
    const { from, to, upgrade } = props;
    const style = {
      "--border": BorderColours[to.border]
    } as React.CSSProperties;

    return (
      <article className={styles.card} style={style}>
        <Hero
          border={to.border}
          id={upgrade.servant}
          name={servant.name}
          icon={servant.icon}
          na={servant.na}
        />
        <Title
          id={upgrade.servant}
          servant={servant}
          suffix={`Skill ${to.num}`}
          {...highlight}
        />
        <Subtitle
          icon="skill"
          prefix={questPrefix}
          name={quest.name}
          {...highlight}
        />
        <SkillUpgrade upgrade={upgrade} from={from} to={to} />
        <UpgradeInfo
          quest={quest}
          questId={upgrade.quest}
          servant={servant}
          servantId={upgrade.servant}
        />
      </article>
    );
  }

  if (isNPUpgrade(props)) {
    const { from, to, upgrade } = props;
    const style = {
      "--border": BorderColours[to.border]
    } as React.CSSProperties;

    return (
      <article className={styles.card} style={style}>
        <Hero
          border={to.border}
          id={upgrade.servant}
          name={servant.name}
          icon={servant.icon}
          na={servant.na}
        />
        <Title
          id={upgrade.servant}
          servant={servant}
          suffix="NP"
          {...highlight}
        />
        <Subtitle
          icon="np"
          prefix={questPrefix}
          name={quest.name}
          {...highlight}
        />
        <NPUpgrade upgrade={upgrade} from={from} to={to} />
        <UpgradeInfo
          quest={quest}
          questId={upgrade.quest}
          servant={servant}
          servantId={upgrade.servant}
        />
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <Hero
        border={Borders.BLUE}
        id={props.upgrade.servant}
        name={servant.name}
        icon={servant.icon}
        na={servant.na}
      />
      <Title
        id={props.upgrade.servant}
        servant={servant}
        suffix=""
        {...highlight}
      />
      <Subtitle
        icon="sq"
        prefix={questPrefix}
        name={quest.name}
        {...highlight}
      />
      <UpgradeInfo
        quest={quest}
        questId={props.upgrade.quest}
        servant={servant}
        servantId={props.upgrade.servant}
      />
    </article>
  );
}
