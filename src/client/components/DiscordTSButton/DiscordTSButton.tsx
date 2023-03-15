import { ActionButton } from "src/client/components/Button";
import { IconDiscord } from "src/client/components/icons";
import { formatTS } from "./formatTS";
import { handleCopy } from "./handleCopy";

type DiscordTSButtonProps = React.PropsWithChildren &
  Parameters<typeof formatTS>[0];

export function DiscordTSButton({
  children,
  ...tsProps
}: DiscordTSButtonProps) {
  const text = formatTS(tsProps);

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
