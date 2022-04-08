//import styles from "./MissionListItem.module.css";

export default function MissionListItem({ detail }) {
  return (
    <li>
      {typeof detail === "string"
        ? detail
        : detail.map((piece, idx) =>
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
