import { useMemo } from "react";
//import styles from "./TrainingLootList.module.css";
import { FGOItemList, FGOItemListItem } from "~/components/FGOItemList";

export default function TrainingLootList({ data }) {
  const { pieceData, monumentData } = useMemo(
    () => ({
      pieceData: {
        name: `${data.class} Piece`,
        icon: data.piece,
        background: "silver"
      },
      monumentData: {
        name: `${data.class} Monument`,
        icon: data.monument,
        background: "gold"
      }
    }),
    [data]
  );

  return (
    <>
      <h2>Daily Training Ground</h2>
      <FGOItemList>
        <FGOItemListItem data={pieceData} />
        <FGOItemListItem data={monumentData} />
      </FGOItemList>
    </>
  );
}
