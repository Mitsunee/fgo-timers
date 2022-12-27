//import { useStore } from "@nanostores/react";
import styles from "./Layout.module.css";
//import { uiStore } from "@stores/uiStore";
import Header from "@components/Header";
import Loading from "@components/Loading";
import Navigation from "@components/Navigation";
import Footer from "@components/Footer";
import SettingsMenu from "@components/SettingsMenu";

export default function Layout({ children, loading = false }) {
  return (
    <>
      <Header />
      <div className={styles.inner}>
        <Navigation />
        <main>{loading ? null : children}</main>
      </div>
      <Footer />
      <SettingsMenu />
      {loading && <Loading /> /* TODO: replace with Pending in .inner */}
    </>
  );
}
