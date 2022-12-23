import styles from "./SearchMatch.module.css";

interface SearchMatchProps {
  text: string;
  index: number;
  length: number;
}

export function SearchMatch({ text, index, length }: SearchMatchProps) {
  const end = index + length;
  const before = text.slice(0, index);
  const match = text.slice(index, end);
  const after = text.substring(end);

  return (
    <span className={styles.text} title={text}>
      {before}
      {match && <b>{match}</b>}
      {after}
    </span>
  );
}
