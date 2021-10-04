import { parseJsonFile } from "@utils/server/parseJsonFile";

//import styles from "@styles/UpgradesPage.module.css";
import Meta from "@components/Meta";

export default function UpgradesPage({ idk }) {
  return (
    <>
      <Meta
        title="Upgrades"
        description="Explore the Interlude and Rank Up Quests of Fate/Grand Order"
      />
      <pre>
        {
          // DEBUG
          JSON.stringify(idk, null, 2)
        }
      </pre>
    </>
  );
}

export async function getStaticProps() {
  const idk = await parseJsonFile("assets/data/upgrades/upgrades.json");

  return {
    props: { idk }
  };
}
