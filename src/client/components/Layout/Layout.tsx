import { useStore } from "@nanostores/react";
import { useRouterLoading } from "src/client/utils/hooks/useRouterLoading";
import { setMobileNavOpen, uiStore } from "src/client/stores/uiStore";
import { Pending } from "src/client/components/Pending";
import { SettingsMenu } from "src/client/components/SettingsMenu";
import { Modal } from "src/client/components/Modal";
import { ActionButton } from "src/client/components/Button";
import { IconClose } from "src/client/components/icons";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import styles from "./Layout.module.css";

export function Layout({ children }: React.PropsWithChildren) {
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
            aria-controls="main-menu"
            aria-expanded="true"
          />
          <Navigation />
        </Modal>
      )}
    </>
  );
}
