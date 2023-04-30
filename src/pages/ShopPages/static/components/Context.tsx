import {
  CCContext,
  CEContext,
  ItemContext,
  MysticCodeContext,
  ServantContext
} from "src/client/contexts";
import type { collectDataMaps } from "../collectDataMaps";

type ContextProps = React.PropsWithChildren &
  Awaited<ReturnType<typeof collectDataMaps>>;

export function Context(props: ContextProps) {
  return (
    <ServantContext value={props.servants}>
      <ItemContext value={props.items}>
        <CEContext value={props.ces}>
          <CCContext value={props.ccs}>
            <MysticCodeContext value={props.mcs}>
              {props.children}
            </MysticCodeContext>
          </CCContext>
        </CEContext>
      </ItemContext>
    </ServantContext>
  );
}
