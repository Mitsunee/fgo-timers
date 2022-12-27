import { useStore } from "@nanostores/react";
import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import { setMobileNavOpen, uiStore } from "@stores/uiStore";
import Header from "@components/Header"; // TODO: move these components into here and fix paths
import { Pending } from "@components/Pending";
import Navigation from "@components/Navigation";
import Footer from "@components/Footer";
import SettingsMenu from "@components/SettingsMenu";
import { Modal } from "@components/Modal";
import styles from "./Layout.module.css";
import { ActionButton } from "@components/Button";
import { IconClose } from "@components/icons";

export default function Layout({ children }: React.PropsWithChildren) {
  const loading = useRouterLoading();
  const { mobileOpen } = useStore(uiStore);

  return (
    <>
      <Header />
      <div className={styles.inner}>
        {loading ? (
          <main>
            <Pending />
          </main>
        ) : (
          <>
            <Navigation />
            <main>{children}</main>
          </>
        )}
      </div>
      <Footer />
      <SettingsMenu />
      {mobileOpen && (
        <Modal>
          <ActionButton
            className={styles.close}
            onClick={() => setMobileNavOpen(false)}
            icon={IconClose}
            decorated={false}
          />
          <Navigation />
        </Modal>
      )}
    </>
  );
}
