import { InlineIcon } from "src/client/components/InlineIcon";
import { SearchMatch, SpoileredText } from "src/client/components/Text";
import { nameServantClass } from "src/servants/classNames";
import type { BundledServant } from "src/servants/types";
import type { Highlight } from "./types";

type TitleProps = {
  id: number;
  servant: BundledServant;
  suffix: string;
} & Highlight;

type SubtitleProps = {
  icon: "skill" | "np" | "sq";
  prefix: string;
  name: string;
} & Highlight;

export function Title({
  id,
  servant,
  suffix,
  match,
  index,
  length
}: TitleProps) {
  const highlight: Highlight =
    match && match == servant.name ? { match, index, length } : {};

  return (
    <>
      <h1>
        <SpoileredText
          id={id}
          placeholder={`${servant.rarity}* ${nameServantClass(
            servant.classId
          )}`}
          na={servant.na}>
          {highlight.match ? (
            <SearchMatch
              text={servant.name}
              index={highlight.index}
              length={highlight.length}
            />
          ) : (
            servant.name
          )}
          {suffix && ` ${suffix}`}
        </SpoileredText>
      </h1>
    </>
  );
}

const icons = {
  np: { id: 8, title: "Noble Phantasm Upgrade" },
  skill: { id: 9, title: "Skill Upgrade" },
  sq: { id: 6, title: "Saint Quartz Interlude" }
} as const; // satisfies Record<SubtitleProps["icon"],{id:number,title:string}> in Typescript 4.9

export function Subtitle({
  icon,
  prefix,
  name,
  match,
  index,
  length
}: SubtitleProps) {
  const highlight = match && match == name ? { match, index, length } : {};

  return (
    <h2>
      {prefix}
      {highlight.match && highlight.match == name ? (
        <SearchMatch
          text={name}
          index={highlight.index}
          length={highlight.length}
        />
      ) : (
        name
      )}{" "}
      <InlineIcon
        icon={`https://static.atlasacademy.io/JP/Items/${icons[icon].id}.png`}
        title={icons[icon].title}
      />
    </h2>
  );
}
