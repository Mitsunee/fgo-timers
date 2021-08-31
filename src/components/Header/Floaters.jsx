import styles from "./Floaters.module.css";
import { setMobileNavOpen } from "@stores/uiStore";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";

// TODO: these don't need to be extra files really
import DiscordIcon from "./DiscordIcon";
import SettingsIcon from "./SettingsIcon";
import HamburgerIcon from "./HamburgerIcon";

export default function Floaters({ inline = false }) {
  const [currentBreakpoint, breakpoints] = useThemeBreakpoint();

  const handleMobileNavButton = () => setMobileNavOpen(state => !state);

  // TODO: refactor to use new <Button> component

  return (
    <div
      className={
        inline ? `${styles.floaters} ${styles.inline}` : styles.floaters
      }>
      <a
        href="https://discord.gg/ZncPkjw"
        target="_blank"
        rel="noopener noreferrer">
        <DiscordIcon />
      </a>
      <button
        // TODO: implement settings
        onClick={() => alert("UNIMPLEMENTED")} // PLACEHOLDER
      >
        <SettingsIcon />
      </button>
      {currentBreakpoint <= breakpoints[2] && (
        <button onClick={handleMobileNavButton}>
          <HamburgerIcon />
        </button>
      )}
    </div>
  );
}
