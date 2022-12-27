import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import Header from "@components/Header";
import Navigation from "@components/Navigation";
import Footer from "@components/Footer";
import SettingsMenu from "@components/SettingsMenu";
import { Pending } from "@components/Pending";
import styles from "./Layout.module.css";

export default function Layout({ children }: React.PropsWithChildren) {
  const loading = useRouterLoading();

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
    </>
  );
}
