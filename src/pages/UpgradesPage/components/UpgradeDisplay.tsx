import {
  BorderedNPIcon,
  BorderedSkillIcon
} from "~/client/components/BorderedIcon";
import { useNPMap, useSkillMap } from "~/client/contexts";
import { AtlasLink } from "~/components/AtlasLink";
import { SpoileredText } from "~/components/Text";
import { getSkillNum } from "~/servants/getSkillNum";
import type {
  BundledUpgrade,
  UpgradeMap,
  UpgradeMapNP,
  UpgradeMapSkill
} from "~/upgrades/types";
import styles from "./UpgradeDisplay.module.css";

type Props<U extends UpgradeMap> = {
  upgrade: BundledUpgrade & { upgrades: U };
  bypassSpoilers?: true;
};
type SkillUpgradeProps = Props<UpgradeMapSkill>;
type NPUpgradeProps = Props<UpgradeMapNP>;

function Arrow() {
  return (
    <div className={styles.icon} style={{ gridRow: "span 2" }}>
      <img src="/assets/arrow_04.png" alt="arrow" width="42" height="47" />
    </div>
  );
}

export function SkillUpgrade({ upgrade, bypassSpoilers }: SkillUpgradeProps) {
  const skillMap = useSkillMap();
  const {
    servant,
    upgrades: { id = 0, newId }
  } = upgrade;
  const from = skillMap[id];
  const fromNum = getSkillNum(from, servant);
  const to = skillMap[newId];
  const toNum = getSkillNum(to, servant);

  return (
    <section className={styles.grid}>
      <div className={styles.icon}>
        <BorderedSkillIcon
          disableSpoilers={bypassSpoilers}
          skillId={id}
          servantId={servant}
        />
      </div>
      <Arrow />
      <div className={styles.icon}>
        <BorderedSkillIcon
          disableSpoilers={bypassSpoilers}
          skillId={newId}
          servantId={servant}
        />
      </div>
      <div className={styles.text}>
        {id > 1 && (
          <>
            <SpoileredText
              id={id}
              placeholder={`Skill ${fromNum}`}
              na={from.na || bypassSpoilers}>
              {from.name}
            </SpoileredText>{" "}
            <AtlasLink
              link={`servant/${servant}/skill-${fromNum}`}
              na={from.na}
              targetBlank
            />
          </>
        )}
      </div>
      <div className={styles.text}>
        <SpoileredText
          id={newId}
          placeholder={`Skill ${toNum}`}
          na={to.na || bypassSpoilers}>
          {to.name}
        </SpoileredText>{" "}
        <AtlasLink
          link={`servant/${servant}/skill-${toNum}`}
          na={to.na}
          targetBlank
        />
      </div>
    </section>
  );
}

export function NPUpgrade({ upgrade, bypassSpoilers }: NPUpgradeProps) {
  const npMap = useNPMap();
  const {
    servant,
    upgrades: { id, newId }
  } = upgrade;
  const from = npMap[id];
  const to = npMap[newId];

  return (
    <section className={styles.grid}>
      <div className={styles.icon}>
        <BorderedNPIcon npId={id} />
      </div>
      <Arrow />
      <div className={styles.icon}>
        <BorderedNPIcon npId={newId} />
      </div>
      <div className={styles.text}>
        <SpoileredText
          id={id}
          placeholder="Noble Phantasm"
          na={from.na || bypassSpoilers}>
          {from.name}
        </SpoileredText>{" "}
        <AtlasLink
          link={`servant/${servant}/noble-phantasms`}
          na={from.na}
          targetBlank
        />
      </div>
      <div className={styles.text}>
        <SpoileredText
          id={newId}
          placeholder="Noble Phantasm"
          na={to.na || bypassSpoilers}>
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
