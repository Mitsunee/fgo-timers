import styles from "./Floaters.module.css";
import { setMobileNavOpen } from "@stores/navigationStore";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";

export default function Floaters({ inline = false }) {
  const [currentBreakpoint, breakpoints] = useThemeBreakpoint();

  const handleMobileNavButton = () => setMobileNavOpen(state => !state);

  return (
    <div
      className={
        inline ? `${styles.floaters} ${styles.inline}` : styles.floaters
      }>
      {/* TODO: Discord button */}
      {/* TODO: Settings button */}
      <button
      // PLACEHOLDER
      >
        P
      </button>
      {currentBreakpoint <= breakpoints[2] && (
        <button onClick={handleMobileNavButton}>
          ={/* TODO: Hamburger button */}
        </button>
      )}
    </div>
  );
}
