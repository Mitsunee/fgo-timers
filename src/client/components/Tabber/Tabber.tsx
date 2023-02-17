import { LinkButton } from "@components/Button";
import cc from "classcat";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import styles from "./Tabber.module.css";

type Tab = { label: string; path: string; enabled: boolean };
export type Tabs = Tab[];

interface TabberProps<T extends Tabs> extends ComponentPropsCC<"div"> {
  tabs: T;
  current: T[number]["label"];
}

export function Tabber<T extends Tabs>({
  tabs,
  current,
  className,
  ...props
}: TabberProps<T>) {
  const tabsFiltered = tabs.filter(tab => tab.enabled);

  if (tabsFiltered.length < 2) return null;

  return (
    <div
      {...props}
      role="navigation"
      className={cc([styles.wrapper, className])}>
      {tabsFiltered.map(({ path, label }) => (
        <LinkButton
          key={path}
          href={`${path}#tabs`}
          className={cc([styles.tab, label == current && styles.current])}
          replace>
          {label}
        </LinkButton>
      ))}
    </div>
  );
}
