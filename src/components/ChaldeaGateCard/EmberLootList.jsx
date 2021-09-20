import { useMemo } from "react";

//import styles from "./EmberLootList.module.css";
import { FGOItemList, FGOItemListItem } from "@components/FGOItemList";

export default function EmberLootList({ data }) {
  const emberList = useMemo(
    () =>
      data.map(ember => ({
        key: ember.class,
        itemData: {
          name: `${ember.class} Embers`,
          icon: ember.ember,
          background: "clear"
        }
      })),
    [data]
  );

  return (
    <>
      <h2>Daily Ember Gathering</h2>
      <FGOItemList>
        {emberList.map(({ key, itemData }) => (
          <FGOItemListItem key={key} data={itemData} />
        ))}
      </FGOItemList>
    </>
  );
}
