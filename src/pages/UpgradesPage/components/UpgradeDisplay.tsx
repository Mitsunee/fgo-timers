import {
  BorderedNPIcon,
  BorderedSkillIcon
} from "src/client/components/BorderedIcon";
import { SpoileredText } from "src/client/components/Text";
import type { BundledNP, BundledSkill } from "src/servants/types";
import styles from "./UpgradeDisplay.module.css";

type Props<T> = { id: number; from: T; newId: number; to: T };
type SkillUpgradeProps = Props<BundledSkill>;
type NPUpgradeProps = Props<BundledNP>;

function Arrow() {
  return (
    <div className={styles.icon} style={{ gridRow: "span 2" }}>
      <img src="/assets/arrow_04.png" alt="arrow" width="42" height="47" />
    </div>
  );
}

// TODO: Atlas DB links

export function SkillUpgrade({ id, from, newId, to }: SkillUpgradeProps) {
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
          <SpoileredText id={id} placeholder={`Skill ${from.num}`} na={from.na}>
            {from.name}
          </SpoileredText>
        )}
      </div>
      <div className={styles.text}>
        <SpoileredText id={newId} placeholder={`Skill ${to.num}`} na={to.na}>
          {to.name}
        </SpoileredText>
      </div>
    </section>
  );
}

export function NPUpgrade({ id, from, newId, to }: NPUpgradeProps) {
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
        </SpoileredText>
      </div>
      <div className={styles.text}>
        <SpoileredText id={newId} placeholder="Noble Phantasm" na={to.na}>
          {to.name}
        </SpoileredText>
      </div>
    </section>
  );
}
