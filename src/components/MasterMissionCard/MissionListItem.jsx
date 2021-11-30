import { useMemo } from "react";

//import styles from "./MissionListItem.module.css";

function Span({ children, col }) {
  return <span style={{ color: col }}>{children}</span>;
}

function coloredDetail(detail) {
  const split = [];
  let seekClose = false;

  // loop through subject string
  for (let pos = 0; pos < detail.length; pos++) {
    const remaining = detail.slice(pos);
    const char = detail[pos];
    const prevIdx = split.length - 1;

    if (seekClose) {
      // looking for closing tag
      if (remaining.startsWith("[-]")) {
        pos += 2; // advance pointer to ]
        seekClose = false;
        split.push(""); // add new element
        continue;
      }

      // not the closing tag yet
      split[prevIdx].content += char;
      continue;
    }

    if (char === "[") {
      // found potential start of next color
      const match = remaining.match(/^\[([a-f0-9]{6})\]/i);

      if (!match) {
        // false alarm, wasn't a color
        split[prevIdx] += char;
        continue;
      }

      // found new color
      pos += 7;
      split.push({
        col: `#${match[1]}`,
        content: ""
      });
      seekClose = true;
      continue;
    }

    // default
    if (prevIdx < 0) {
      // split was empty
      split.push(`${char}`);
      continue;
    }
    split[prevIdx] += char;
  }

  return split;
}

export default function MissionListItem({ detail }) {
  const memo = useMemo(
    // test for color codes, if any found use coloredDetail function
    () => (/\[[a-f0-9]{6}\]/i.test(detail) ? coloredDetail(detail) : detail),
    [detail]
  );

  return (
    <li>
      {typeof memo === "string"
        ? memo
        : memo.map((piece, idx) => {
            if (piece === "") return null;
            if (typeof piece === "string")
              return <span key={idx}>{piece}</span>;
            const { col, content } = piece;
            return (
              <Span col={col} key={idx}>
                {content}
              </Span>
            );
          })}
    </li>
  );
}
