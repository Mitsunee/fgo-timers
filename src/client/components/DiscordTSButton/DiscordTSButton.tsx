import { useStore } from "@nanostores/react";
import { settingsStore } from "~/client/stores/settingsStore";
import { ActionButton } from "~/components/Button";
import { IconDiscord } from "~/components/icons";
import { formatTS } from "./formatTS";
import { handleCopy } from "./handleCopy";

type DiscordTSButtonProps = React.PropsWithChildren &
  Parameters<typeof formatTS>[0];

export function DiscordTSButton({
  children,
  ...tsProps
}: DiscordTSButtonProps) {
  const { discordMd } = useStore(settingsStore);
  const text = formatTS(tsProps, discordMd);

  return (
    <ActionButton
      icon={IconDiscord}
      onClick={ev => {
        handleCopy(ev, text);
      }}>
      {children}
    </ActionButton>
  );
}
