import { InlineSvg } from "src/client/components/InlineIcon";
import { IconAtlas } from "src/client/components/icons";

interface AtlasLinkProps extends React.PropsWithChildren {
  link: string;
  na?: true;
  targetBlank?: true;
}

export function AtlasLink({ children, link, na, targetBlank }: AtlasLinkProps) {
  const href = `https://apps.atlasacademy.io/db/${na ? "NA" : "JP"}/${link}`;
  const props: React.ComponentProps<"a"> = { href };

  if (targetBlank) {
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  }

  return (
    <a {...props}>
      {children}
      {children ? " " : ""}
      <InlineSvg icon={IconAtlas} />
    </a>
  );
}
