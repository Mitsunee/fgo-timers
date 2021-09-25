import { useState } from "react";
import { useStore } from "nanostores/react";

import styles from "./APCalcCard.module.css";
import { settingsStore, setSetting } from "@stores/settingsStore";
import { useInputNumberValue } from "@utils/hooks/useInputNumberValue";
import { clamp } from "@utils/clamp";
import { Card } from "@components/Card";
import { Select, SelectOption } from "@components/Select";
import InputNumber from "@components/InputNumber";
import Input from "@components/Input";

const validateApOffset = value => /^[0-4]:[0-5][1-9]$/.test(value);

// TODO: actual calculation
// TODO: output
// TODO: change nodeCost to use settingsStore

export default function APCalc({ border, background }) {
  const [formMode, setFormMode] = useState("byTargetAp");
  const { userMaxAP } = useStore(settingsStore);
  const [currentAp, setCurrentAp] = useInputNumberValue(0);
  const [apOffset, setApOffset] = useState("0:01");
  const [apTarget, setApTarget] = useInputNumberValue(0);
  const [nodeCost, setNodeCost] = useInputNumberValue(40);

  const handleFormMode = ({ event, value }) => {
    event.target.blur();
    setFormMode(value);
  };

  const handleMaxAP = ev => {
    setSetting("userMaxAP", ev.target.value);
  };

  const sanitizeApOffset = ev => {
    const match = ev.target.value.match(/(\d)?:?([\d]{1,2})?/);

    // if it's already valid don't re-render
    if (validateApOffset(match[0])) return;

    // re-render with sanitized offset
    const seconds = clamp({ value: match[2] ?? 1, min: 1, max: 59 });
    setApOffset(
      match
        ? `${clamp({ value: match[1], min: 0, max: 4 }) ?? 0}:${
            seconds < 10 ? 0 : ""
          }${seconds}`
        : "0:00"
    );
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
        <div
          className={
            formMode === "byMaxAp"
              ? styles.formGrid
              : `${styles.formGrid} ${styles.withFourthCol}`
          }>
          <div className={styles.formItem}>
            <label htmlFor="user-max-ap">Max AP</label>
            <InputNumber
              name="user-max-ap"
              value={userMaxAP}
              min={20}
              max={142}
              onChange={handleMaxAP}
            />
          </div>
          <div className={styles.formItem}>
            <label htmlFor="user-current-ap">Current AP</label>
            <InputNumber
              name="user-current-ap"
              value={currentAp}
              min={0}
              max={userMaxAP}
              onChange={setCurrentAp}
            />
          </div>
          <div className={styles.formItem}>
            <label htmlFor="user-ap-offset">Next AP in</label>
            <Input
              name="user-ap-offset"
              value={apOffset}
              maxLength={4}
              onChange={ev => setApOffset(ev.target.value)}
              onBlur={sanitizeApOffset}
              customValidation={validateApOffset}
            />
          </div>
          {formMode === "byTargetAp" && (
            <div className={styles.formItem}>
              <label htmlFor="user-ap-target">Target AP</label>
              <InputNumber
                name="user-ap-target"
                value={apTarget}
                min={currentAp}
                max={userMaxAP}
                onChange={setApTarget}
              />
            </div>
          )}
          {formMode === "byNodeCost" && (
            <div className={styles.formItem}>
              <label htmlFor="user-node-cost">Node Cost</label>
              <InputNumber
                name="user-node-cost"
                value={nodeCost}
                min={3}
                max={40}
                onChange={setNodeCost}
              />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
