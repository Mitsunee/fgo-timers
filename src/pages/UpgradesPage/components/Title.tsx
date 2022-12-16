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

export function Subtitle({
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
      )}
    </h2>
  );
}
