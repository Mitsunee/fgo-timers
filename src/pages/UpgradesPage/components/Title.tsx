import { InlineIcon } from "src/client/components/InlineIcon";
import { SearchMatch, SpoileredText } from "src/client/components/Text";
import type { Highlight } from "../types";

type TitleProps = {
  id: number;
  name: string;
  placeholder: string;
  suffix: string;
  na?: true;
} & Highlight;

type SubtitleProps = {
  icon: "skill" | "np" | "sq";
  prefix: string;
  name: string;
} & Highlight;

export function Title({
  id,
  name,
  na,
  placeholder,
  suffix,
  match,
  index,
  length
}: TitleProps) {
  const highlight: Highlight =
    match && match == name ? { match, index, length } : {};

  return (
    <>
      <h1>
        <SpoileredText id={id} placeholder={placeholder} na={na}>
          {highlight.match ? (
            <SearchMatch
              text={name}
              index={highlight.index}
              length={highlight.length}
            />
          ) : (
            name
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
      {prefix}{" "}
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
