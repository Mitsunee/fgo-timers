import styles from "./Floaters.module.css";
import { setMobileNavOpen, setSettingsMenuOpen } from "@stores/uiStore";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";
import { svgDiscord, svgSettings, svgHamburger } from "@utils/svgIcons";
import Button from "@components/Button";

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
        iconSvg={svgDiscord}
        disableDefaultStyle
        className={styles.buttonDiscord}
      />
      <Button
        onClick={() => setSettingsMenuOpen(true)}
        iconSvg={svgSettings}
        disableDefaultStyle
        className={styles.button}
      />
      {currentBreakpoint <= breakpoints[2] && (
        <Button
          onClick={handleMobileNavButton}
          iconSvg={svgHamburger}
          disableDefaultStyle
          className={styles.button}
        />
      )}
    </div>
  );
}
