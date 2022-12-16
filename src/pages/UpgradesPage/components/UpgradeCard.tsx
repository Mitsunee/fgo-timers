import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import {
  QuestUpgrade,
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

type PropsBase = { servant: BundledServant; quest: QuestUpgrade };
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
  const questName =
    quest.type === UpgradeQuestType.RANKUP && quest.na
      ? quest.name
      : `${
          quest.type == UpgradeQuestType.INTERLUDE ? "Interlude" : "Rank Up"
        }: ${quest.name}`;

  if (isSkillUpgrade(props)) {
    const { from, to, upgrade } = props;
    const skillId = upgrade.upgrades.id ?? 0;
    const style = {
      "--border": BorderColours[to.border]
    } as React.CSSProperties;

    return (
      <article className={styles.card} style={style}>
        <Hero icon={servant.icon} title={questName} border={to.border} />
        <SkillUpgrade
          id={skillId}
          from={from}
          newId={upgrade.upgrades.newId}
          to={to}
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
        <Hero icon={servant.icon} title={questName} border={to.border} />
        <NPUpgrade
          id={upgrade.upgrades.id}
          from={from}
          newId={upgrade.upgrades.newId}
          to={to}
        />
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <Hero icon={servant.icon} title={questName} border={Borders.BLUE} />
      <section>SQ INTLD {/* PLACEHOLDER */}</section>
    </article>
  );
}

/* TODO: implement nice icons in title?
          <InlineIcon
            icon="https://static.atlasacademy.io/JP/Items/9.png"
            title="Skill Upgrade"
            className={styles.quest}
          />
          <InlineIcon
            icon="https://static.atlasacademy.io/JP/Items/8.png"
            title="NP Upgrade"
            className={styles.quest}
          />
        <InlineIcon
          icon="https://static.atlasacademy.io/JP/Items/6.png"
          title="SQ Interlude"
          className={styles.quest}
        />
    */
