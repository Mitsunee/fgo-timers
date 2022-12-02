import type { InferGetStaticPropsType } from "next";
import useSWR, { SWRConfig } from "swr";
import { useReducer } from "react";
import { getStaticProps } from "src/server/UpgradesPage";
import { fetcher, UpgradesPageData } from "src/server/DataApi";
import { /*BundledQuest, */ UpgradeQuestType } from "src/upgrades/types";
import { ClassName } from "@atlasacademy/api-connector";
import {
  BundledServant /*,BundledSkill, BundledNP */
} from "src/servants/types";
//import styles from "src/client/styles/UpgradesPage.module.css";

export { getStaticProps };
type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;

type SelectableClassId =
  | ClassName.SABER
  | ClassName.ARCHER
  | ClassName.LANCER
  | ClassName.RIDER
  | ClassName.CASTER
  | ClassName.ASSASSIN
  | ClassName.BERSERKER
  | ClassName.EXTRA;

interface FormState {
  region: null | "NA" | "JP";
  target: null | "skill" | "np" | "sq";
  type: null | UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  classId: Record<SelectableClassId, boolean>;
  query: string;
}

const formStateDefault: FormState = {
  region: null,
  target: null,
  type: null,
  classId: {
    [ClassName.SABER]: false,
    [ClassName.ARCHER]: false,
    [ClassName.LANCER]: false,
    [ClassName.RIDER]: false,
    [ClassName.CASTER]: false,
    [ClassName.ASSASSIN]: false,
    [ClassName.BERSERKER]: false,
    [ClassName.EXTRA]: false
  },
  query: ""
};

type FormAction =
  | { type: "region"; value: FormState["region"]; key?: undefined }
  | { type: "target"; value: FormState["target"]; key?: undefined }
  | { type: "type"; value: FormState["type"]; key?: undefined }
  | { type: "query"; value: FormState["query"]; key?: undefined }
  | { type: "classId"; key: SelectableClassId; value: boolean };

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "region":
    case "target":
    case "type":
    case "query":
      return { ...state, [action.type]: action.value };
    case "classId":
      return {
        ...state,
        classId: { ...state.classId, [action.key]: action.value }
      };
  }
}

function Page() {
  const res = useSWR("/api/data/upgrades", fetcher<UpgradesPageData>, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const [form, _dispatch] = useReducer(reducer, formStateDefault);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = (action: FormAction) =>
    !res.isValidating && _dispatch(action);

  const upgrades = res.data!.upgrades;
  //const questMap = res.data!.quests as Record<number, BundledQuest>;
  const servantMap = res.data!.servants as Record<number, BundledServant>;
  //const skillMap = res.data!.skills as Record<number, BundledSkill>;
  //const npMap = res.data!.nps as Record<number, BundledNP>;

  const selectedClasses = new Set(
    (Object.entries(form.classId) as Array<[SelectableClassId, boolean]>)
      .filter(entry => entry[1])
      .map(entry => entry[0])
  );

  const displayedUpgrades = res.isValidating
    ? upgrades
    : upgrades
        .filter(upgrade => {
          const servant = servantMap[upgrade.servant];
          const isExtra: boolean = false; // TODO: method (servant.classId);
          return selectedClasses.size > 0
            ? selectedClasses.has(
                isExtra
                  ? ClassName.EXTRA
                  : (servant.classId as SelectableClassId)
              )
            : true;
        })
        .slice(0, 10);

  if (res.error) {
    return <h1>ERROR: {res.error}</h1>;
  }

  return (
    <>
      <h1>DEBUG: {res.isValidating ? "FETCHING" : "DONE"}</h1>
      <code>
        <pre>
          {JSON.stringify(
            {
              form,
              selectedClasses: Array.from(selectedClasses),
              displayedUpgrades
            },
            null,
            2
          )}
        </pre>
      </code>
    </>
  );
}

export default function UpgradesPage(fallback: UpgradesPageProps) {
  return (
    <SWRConfig value={fallback}>
      <Page />
    </SWRConfig>
  );
}
