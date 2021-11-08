import { useEffect } from "react";
import cc from "classcat";
import { basename } from "path";

import { getFileList } from "@utils/server/getFileList";

import styles from "@styles/HomePage.module.css";
import Meta from "@components/Meta";
import { ButtonRow, Button } from "@components/Button";
import { IconDiscord } from "@components/icons";
import Headline from "@components/Headline";
import Section from "@components/Section";

export default function HomePage({ backgrounds }) {
  useEffect(() => {
    // only in client
    if (typeof document === "undefined") return;

    // pick random background
    const backgroundFile =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const background = `url("${backgroundFile}")`;

    // set css property and attach className
    document.body.style.setProperty("--landing-bg", background);
    document.body.classList.add(styles.body);

    return () => {
      document.body.classList.remove(styles.body);
    };
  }, [backgrounds]);

  return (
    <>
      <Meta
        title="FGO Tools"
        description="Fate/Grand Order Tools by Mitsunee"
        noTitleSuffix
      />
      <Section className={styles.section}>
        <Headline>FGO Tools</Headline>
        <img src="/icon-512.png" alt="FGO Tools" />
        <ButtonRow align="center">
          <Button
            href="https://discord.gg/ZncPkjw"
            targetBlank
            iconComponent={IconDiscord}
            className={cc([styles.button, styles.discord])}>
            Join the Neko-Castle Discord Server
          </Button>
          <Button disabled>Sponsor on Github (Coming soon!)</Button>
        </ButtonRow>
        <p>
          {"Made by "}
          <a
            href="https://twitter.com/mitsunee"
            target="_blank"
            rel="noopener noreferrer">
            Mitsunee
          </a>{" "}
          | &ldquo;Fate/Grand Order&rdquo; is a trademark of Notes Co., Ltd. |
          Game Assets &copy; Aniplex Inc. used under fair use.
          <br />
          {"Thanks to: "}
          <a
            href="https://atlasacademy.io/"
            target="_blank"
            rel="noopener noreferrer">
            Atlas Academy
          </a>
          {" for their Game Data API, "}
          <a
            href="https://github.com/spencermountain/spacetime"
            target="_blank"
            rel="noopener noreferrer">
            Spacetime
          </a>
          {" for timezone conversion, "}
          <a
            href="https://iconmonstr.com/"
            target="_blank"
            rel="noopener noreferrer">
            iconmonstr
          </a>
          {" vector icons"}
        </p>
      </Section>
    </>
  );
}

export async function getStaticProps() {
  const backgroundFiles = await getFileList(
    "public/assets/backgrounds/landing"
  );
  const backgrounds = backgroundFiles.map(
    file => `/assets/backgrounds/landing/${basename(file)}`
  );

  return {
    props: { backgrounds }
  };
}
