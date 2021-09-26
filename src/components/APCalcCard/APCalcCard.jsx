import { useState, useEffect } from "react";
import { useStore } from "nanostores/react";

import styles from "./APCalcCard.module.css";
import { settingsStore, setSetting } from "@stores/settingsStore";
import { useIsClient } from "@utils/hooks/useIsClient";
import { useInputNumberValue } from "@utils/hooks/useInputNumberValue";
import { clamp, isClamped } from "@utils/clamp";
import { Card } from "@components/Card";
import { Select, SelectOption } from "@components/Select";
import FormField from "./FormField";
import InputNumber from "@components/InputNumber";
import Input from "@components/Input";
import Results from "./Results";

const validateApOffset = value =>
  /^(0:(0[1-9]|[1-5]\d)|[1-4]:[0-5]\d)$/.test(value);

// constants
// TODO: move into settingsStore?
const MAXAP_MIN_VALUE = 20;
const MAXAP_MAX_VALUE = 142;
const NODE_COST_MIN_VALUE = 3;
const NODE_COST_MAX_VALUE = 40;

// TODO: change nodeCost to use settingsStore

export default function APCalc({ border, background }) {
  const isClient = useIsClient();
  const [formMode, setFormMode] = useState("byTargetAp");
  const { userMaxAP } = useStore(settingsStore);
  const [currentAp, setCurrentAp] = useInputNumberValue(0);
  const [apOffset, setApOffset] = useState("0:01");
  const [apTarget, setApTarget] = useInputNumberValue(0);
  const [nodeCost, setNodeCost] = useInputNumberValue(40);
  const [resultData, setResultData] = useState([]);

  // effect that handles form input and generates resultData
  useEffect(() => {
    // validate required values
    if (
      !isClient ||
      !(
        isClamped({
          value: userMaxAP,
          min: MAXAP_MIN_VALUE,
          max: MAXAP_MAX_VALUE
        }) &&
        isClamped({ value: currentAp, min: 0, max: userMaxAP }) &&
        validateApOffset(apOffset)
      )
    ) {
      // if not valid show empty result
      setResultData([]);
      return;
    }

    // prepare data
    const offsetMatch = apOffset.match(/(\d):(\d)(\d)/);
    const offset =
      300 - (+offsetMatch[1] * 60 + +offsetMatch[2] * 10 + +offsetMatch[3]);
    const renderedAt = Math.floor(Date.now() / 1000) * 1000;
    const now = Math.floor(renderedAt / 1000) - offset;
    const calcTime = apDiff => 1000 * (now + apDiff * 300);

    // Max AP
    const maxApData = {
      text: "Max AP",
      time: calcTime(userMaxAP - currentAp),
      from: renderedAt
    };

    // "byTargetAp"
    if (formMode === "byTargetAp") {
      // check if apTarget is valid, if not return with only max ap
      if (!isClamped({ value: apTarget, min: currentAp, max: userMaxAP })) {
        setResultData([maxApData]);
        return;
      }

      setResultData([
        {
          text: "Target AP",
          time: calcTime(apTarget - currentAp),
          from: renderedAt
        },
        maxApData
      ]);
      return;
    }

    // "byNodeCost"
    if (formMode === "byNodeCost") {
      // check if nodeCost is valid, if not return with only max ap
      if (
        !isClamped({
          value: nodeCost,
          min: NODE_COST_MIN_VALUE,
          max: NODE_COST_MAX_VALUE
        })
      ) {
        setResultData([maxApData]);
        return;
      }

      const possibleRuns = Math.floor(userMaxAP / nodeCost);
      const runs = Array(possibleRuns)
        .fill(1)
        .map((one, index) => ({
          text: `Run #${index + one}`, // variable is used, you happy now eslint?
          time: calcTime(nodeCost * (index + one) - currentAp),
          from: renderedAt
        }));
      setResultData(runs.concat(maxApData));
      return;
    }

    // "byMaxAp"
    setResultData([maxApData]);
  }, [isClient, userMaxAP, currentAp, apOffset, formMode, apTarget, nodeCost]);

  const handleFormMode = ({ event, value }) => {
    event.target.blur();
    setFormMode(value);
  };

  const handleMaxAP = ev => {
    setSetting("userMaxAP", ev.target.value);
  };

  const sanitizeApOffset = ev => {
    const match = ev.target.value.match(/(\d)?:?([\d]{1,2})?/);

    // if no match was found set default value again
    if (match === null) {
      setApOffset("0:01");
      return;
    }

    // if it's already valid don't re-render
    if (validateApOffset(match[0])) return;

    // re-render with sanitized offset
    const minutes = clamp({ value: +match[1] ?? 0, min: 0, max: 4 });
    const min = minutes === 0 ? 1 : 0;
    const seconds = clamp({ value: +match[2] ?? min, min, max: 59 });
    setApOffset(`${minutes}:${seconds < 10 ? 0 : ""}${seconds}`);
  };

  return (
    <>
      <Card
        title="AP Calculator"
        icon="/assets/gApple.png"
        border={border}
        background={background}
        wrapperClassName={styles.cardWrapper}>
        <div className={styles.selectWrapper}>
          <Select value={formMode} onChange={handleFormMode}>
            <SelectOption value="byTargetAp">Use AP Target</SelectOption>
            <SelectOption value="byNodeCost">Use Node Cost</SelectOption>
            <SelectOption value="byMaxAp">Use Max AP</SelectOption>
          </Select>
        </div>
        {isClient && (
          <div
            className={
              formMode === "byMaxAp"
                ? styles.formGrid
                : `${styles.formGrid} ${styles.withFourthCol}`
            }>
            <FormField label="Max AP" htmlFor="user-max-ap">
              <InputNumber
                name="user-max-ap"
                value={userMaxAP}
                min={MAXAP_MIN_VALUE}
                max={MAXAP_MAX_VALUE}
                onChange={handleMaxAP}
              />
            </FormField>
            <FormField label="Current AP" htmlFor="user-current-ap">
              <InputNumber
                name="user-current-ap"
                value={currentAp}
                min={0}
                max={userMaxAP}
                onChange={setCurrentAp}
              />
            </FormField>
            <FormField label="Next AP in" htmlFor="user-ap-offset">
              <Input
                name="user-ap-offset"
                value={apOffset}
                maxLength={4}
                onChange={ev => setApOffset(ev.target.value)}
                onBlur={sanitizeApOffset}
                customValidation={validateApOffset}
              />
            </FormField>
            {formMode === "byTargetAp" && (
              <FormField label="Target AP" htmlFor="user-ap-target">
                <InputNumber
                  name="user-ap-target"
                  value={apTarget}
                  min={currentAp}
                  max={userMaxAP}
                  onChange={setApTarget}
                />
              </FormField>
            )}
            {formMode === "byNodeCost" && (
              <FormField label="Node Cost" htmlFor="user-node-cost">
                <InputNumber
                  name="user-node-cost"
                  value={nodeCost}
                  min={NODE_COST_MIN_VALUE}
                  max={NODE_COST_MAX_VALUE}
                  onChange={setNodeCost}
                />
              </FormField>
            )}
          </div>
        )}
        {resultData.length > 0 && (
          <Results data={resultData} formMode={formMode} />
        )}
      </Card>
    </>
  );
}
