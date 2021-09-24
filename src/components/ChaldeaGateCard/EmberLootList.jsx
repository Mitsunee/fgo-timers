//import styles from "./EmberLootList.module.css";
import { FGOItemList, FGOItemListItem } from "@components/FGOItemList";

export default function EmberLootList({ data }) {
  return (
    <>
      <h2>Daily Ember Gathering</h2>
      <FGOItemList>
        {data.map(date => {
          const itemData = {
            name: `${date.class} Embers`,
            icon: date.ember,
            background: "clear"
          };

          return <FGOItemListItem key={date.class} data={itemData} />;
        })}
      </FGOItemList>
    </>
  );
}
