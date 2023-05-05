import { useServantMap } from "src/client/contexts";
import { InlineIcon } from "src/client/components/InlineIcon";
import { SearchMatch, SpoileredText } from "src/client/components/Text";
import type { Highlight } from "../types";

type TitleProps = {
  id: number;
  placeholder: string;
  suffix: string;
} & Highlight;

type SubtitleProps = {
  icon: "skill" | "np" | "sq";
  prefix: string;
  name: string;
} & Highlight;

export function Title({
  id,
  placeholder,
  suffix,
  match,
  index,
  length
}: TitleProps) {
  const servantMap = useServantMap();
  const { name, na } = servantMap[id];
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
} as const;

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
      {!name.startsWith(prefix) && `${prefix} `}
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
