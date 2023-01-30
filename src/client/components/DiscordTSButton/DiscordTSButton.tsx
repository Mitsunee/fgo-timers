import { ActionButton } from "src/client/components/Button";
import { IconDiscord } from "src/client/components/icons";
import { formatTS } from "./formatTS";
import { handleCopy } from "./handleCopy";

interface DiscordTSButtonProps extends React.PropsWithChildren {
  time: number | number[];
}

export function DiscordTSButton({ children, time }: DiscordTSButtonProps) {
  const text = formatTS(time);

  return (
    <ActionButton icon={IconDiscord} onClick={ev => handleCopy(ev, text)}>
      {children}
    </ActionButton>
  );
}
