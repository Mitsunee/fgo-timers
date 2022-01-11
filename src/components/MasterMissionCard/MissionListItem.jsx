import { useMemo } from "react";

//import styles from "./MissionListItem.module.css";

function parseMissionDetail(detail) {
  // /^\[|\]$/g matches square brackets wrapping the entire string
  // ^\[[a-f0-9]{6}\] matches color tags used in game data

  // it is assumed that the string starts with an optional color tag and maybe
  // contains a format clear tag [-]. It is easier to split on format clear tags
  // either way no matter if a color tag exists

  if (!detail.includes("[-]")) return detail.replace(/^\[|\]$/g, "");

  const [tag, ...texts] = detail.split("[-]"); // not sure if rest operator is needed here
  let tmp;
  if (/^\[[a-f0-9]{6}\]/i.test(tag)) {
    // has color
    const [, color, text] = tag.match(/^\[([a-f0-9]{6})\](.*)/);
    tmp = { color, text: `${text.replace(/^\[|\]$/g, "")}: ` };
  } else {
    tmp = `${tag.replace(/^\[|\]$/g, "")}: `;
  }

  return [tmp, ...texts.map(text => text.trim())];
}

export default function MissionListItem({ detail }) {
  const memo = useMemo(() => parseMissionDetail(detail), [detail]);

  return (
    <li>
      {typeof memo === "string"
        ? memo
        : memo.map((piece, idx) =>
            typeof piece === "string" ? (
              // text-only piece
              <span key={idx}>{piece}</span>
            ) : (
              // piece with color
              <span style={{ color: `#${piece.color}` }} key={idx}>
                {piece.text}
              </span>
            )
          )}
    </li>
  );
}
