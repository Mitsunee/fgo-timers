import { useStore } from "@nanostores/react";
import { setMobileNavOpen, uiStore } from "~/client/stores/uiStore";
import { ActionButton } from "~/components/Button";
import { IconClose } from "~/components/icons";
import { Modal } from "~/components/Modal";
import { Pending } from "~/components/Pending";
import { SettingsMenu } from "~/components/SettingsMenu";
import { useRouterLoading } from "~/hooks/useRouterLoading";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
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
