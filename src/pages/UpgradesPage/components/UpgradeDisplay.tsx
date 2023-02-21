import {
  BorderedNPIcon,
  BorderedSkillIcon
} from "src/client/components/BorderedIcon";
import { SpoileredText } from "src/client/components/Text";
import { AtlasLink } from "src/client/components/AtlasLink";
import type { BundledNP, BundledSkill } from "src/servants/types";
import type {
  BundledUpgrade,
  UpgradeMap,
  UpgradeMapNP,
  UpgradeMapSkill
} from "src/upgrades/types";
import styles from "./UpgradeDisplay.module.css";

type Props<T, U extends UpgradeMap> = {
  from: T;
  to: T;
  upgrade: BundledUpgrade & { upgrades: U };
};
type SkillUpgradeProps = Props<BundledSkill, UpgradeMapSkill>;
type NPUpgradeProps = Props<BundledNP, UpgradeMapNP>;

function Arrow() {
  return (
    <div className={styles.icon} style={{ gridRow: "span 2" }}>
      <img src="/assets/arrow_04.png" alt="arrow" width="42" height="47" />
    </div>
  );
}

export function SkillUpgrade({ upgrade, from, to }: SkillUpgradeProps) {
  const {
    servant,
    upgrades: { id = 0, newId }
  } = upgrade;

  return (
    <section className={styles.grid}>
      <div className={styles.icon}>
        <BorderedSkillIcon skillId={id} {...from} />
      </div>
      <Arrow />
      <div className={styles.icon}>
        <BorderedSkillIcon skillId={newId} {...to} />
      </div>
      <div className={styles.text}>
        {id > 1 && (
          <>
            <SpoileredText
              id={id}
              placeholder={`Skill ${from.num}`}
              na={from.na}>
              {from.name}
            </SpoileredText>{" "}
            <AtlasLink
              link={`servant/${servant}/skill-${from.num}`}
              na={from.na}
              targetBlank
            />
          </>
        )}
      </div>
      <div className={styles.text}>
        <SpoileredText id={newId} placeholder={`Skill ${to.num}`} na={to.na}>
          {to.name}
        </SpoileredText>{" "}
        <AtlasLink
          link={`servant/${servant}/skill-${to.num}`}
          na={to.na}
          targetBlank
        />
      </div>
    </section>
  );
}

export function NPUpgrade({ upgrade, from, to }: NPUpgradeProps) {
  const {
    servant,
    upgrades: { id, newId }
  } = upgrade;

  return (
    <section className={styles.grid}>
      <div className={styles.icon}>
        <BorderedNPIcon npId={id} {...from} />
      </div>
      <Arrow />
      <div className={styles.icon}>
        <BorderedNPIcon npId={newId} {...to} />
      </div>
      <div className={styles.text}>
        <SpoileredText id={id} placeholder="Noble Phantasm" na={from.na}>
          {from.name}
        </SpoileredText>{" "}
        <AtlasLink
          link={`servant/${servant}/noble-phantasms`}
          na={from.na}
          targetBlank
        />
      </div>
      <div className={styles.text}>
        <SpoileredText id={newId} placeholder="Noble Phantasm" na={to.na}>
          {to.name}
        </SpoileredText>{" "}
        <AtlasLink
          link={`servant/${servant}/noble-phantasms`}
          na={to.na}
          targetBlank
        />
      </div>
    </section>
  );
}
