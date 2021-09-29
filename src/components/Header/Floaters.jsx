import styles from "./Floaters.module.css";
import { setMobileNavOpen, setSettingsMenuOpen } from "@stores/uiStore";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";
import { Button } from "@components/Button";
import { IconDiscord, IconSettings, IconHamburger } from "@components/icons";

export default function Floaters({ inline = false }) {
  const [currentBreakpoint, breakpoints] = useThemeBreakpoint();

  const handleMobileNavButton = () => setMobileNavOpen(state => !state);

  return (
    <div
      className={
        inline ? `${styles.floaters} ${styles.inline}` : styles.floaters
      }>
      <Button
        href="https://discord.gg/ZncPkjw"
        targetBlank
        iconComponent={IconDiscord}
        disableDefaultStyle
        className={styles.buttonDiscord}
      />
      <Button
        onClick={() => setSettingsMenuOpen(true)}
        iconComponent={IconSettings}
        disableDefaultStyle
        className={styles.button}
      />
      {currentBreakpoint <= breakpoints[2] && (
        <Button
          onClick={handleMobileNavButton}
          iconComponent={IconHamburger}
          disableDefaultStyle
          className={styles.button}
        />
      )}
    </div>
  );
}
