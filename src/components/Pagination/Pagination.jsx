import { useState, useEffect } from "react";
import { useStore } from "nanostores/react";

import styles from "./Pagination.module.css";
import { settingsStore } from "@stores/settingsStore";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";
import { usePaginationSlice } from "@utils/hooks/usePaginationSlice";
import { isClamped } from "@utils/clamp";
import { Button } from "@components/Button";
import { IconArrow } from "@components/icons";

export default function Pagination({
  elements = 0,
  currentPage = 1,
  isDesc,
  setPage,
  pageUp,
  pageDown,
  toggleSort,
  top = false
}) {
  const { perPage } = useStore(settingsStore);
  const [currentBreakpoint, breakpoints] = useThemeBreakpoint();
  const [display, setDisplay] = useState([]);
  const [startSlice, endSlice] = usePaginationSlice(elements, currentPage);
  const pageCount = Math.ceil(elements / perPage);

  useEffect(() => {
    const isMedium = currentBreakpoint > breakpoints[0]; // show direct siblings of current page
    const isLarge = currentBreakpoint > breakpoints[1]; // also show direct siblings of first and last page

    // can show all pages
    if (
      pageCount <= 3 ||
      (isMedium && pageCount <= 7) ||
      (isLarge && pageCount <= 9)
    ) {
      setDisplay(
        Array(pageCount)
          .fill(1)
          .map((o, idx) => o + idx)
      );
      return;
    }

    let midSection = true;
    let startSection, endSection;

    // startSection and near Start check
    if (
      isClamped({ value: currentPage, max: isLarge ? 4 : isMedium ? 3 : 1 })
    ) {
      midSection = false;
      startSection = Array(isLarge ? 5 : isMedium ? 4 : 2)
        .fill(1)
        .map((o, i) => o + i);
    } else {
      startSection = isLarge ? [1, 2] : [1];
    }

    // endSection and near End check
    if (
      isClamped({
        value: currentPage,
        min: isLarge ? pageCount - 3 : isMedium ? pageCount - 2 : pageCount - 1
      })
    ) {
      midSection = false;
      endSection = Array(isLarge ? 5 : isMedium ? 4 : 2)
        .fill(pageCount)
        .map((o, i) => o - i)
        .reverse();
    } else {
      endSection = isLarge ? [pageCount - 1, pageCount] : [pageCount];
    }

    // midSection
    if (midSection) {
      midSection = isMedium
        ? ["...", currentPage - 1, currentPage, currentPage + 1, "..."]
        : ["...", currentPage, "..."];
    } else {
      midSection = ["..."];
    }

    setDisplay([...startSection, ...midSection, ...endSection]);
  }, [currentBreakpoint, breakpoints, pageCount, currentPage]);

  return (
    <div className={top ? `${styles.wrapper} ${styles.top}` : styles.wrapper}>
      <div className={`${styles.cell} ${styles.infoCell}`}>
        Results {startSlice + 1} to {endSlice} (of {elements})
      </div>
      <div className={`${styles.cell} ${styles.orderCell}`}>
        <Button
          onClick={ev => {
            ev.target.blur();
            toggleSort();
          }}
          iconComponent={IconArrow}
          iconSize="0.95em"
          className={isDesc ? styles.arrow : `${styles.arrow} ${styles.up}`}>
          {isDesc ? "Desc." : "Asc."}
        </Button>
      </div>
      <div className={`${styles.cell} ${styles.buttonCell}`}>
        <Button
          disabled={currentPage === 1}
          onClick={ev => {
            ev.target.blur();
            pageDown();
          }}
          iconComponent={IconArrow}
          iconSize="0.95em"
          className={`${styles.arrow} ${styles.left}`}
        />
        {display.map((item, idx) => (
          <Button
            key={`${item}${item === "..." ? idx : ""}`}
            disabled={item === "..." || item === currentPage}
            className={
              item === "..." || item === currentPage
                ? `${styles.noFilter} ${
                    item === currentPage ? styles.selected : styles.transparent
                  }`
                : undefined
            }
            onClick={
              item === "..."
                ? undefined
                : ev => {
                    ev.target.blur();
                    setPage(item);
                  }
            }>
            {item}
          </Button>
        ))}
        <Button
          disabled={currentPage === pageCount}
          onClick={ev => {
            ev.target.blur();
            pageUp();
          }}
          iconComponent={IconArrow}
          iconSize="0.95em"
          className={`${styles.arrow} ${styles.right}`}
        />
      </div>
    </div>
  );
}
