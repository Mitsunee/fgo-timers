//import styles from "@styles/HomePage.module.css";
import Meta from "@components/Meta";
import { CardGrid, Card } from "@components/Card";
import Headline from "@components/Headline";
import Section from "@components/Section";

export default function HomePage() {
  return (
    <>
      <Meta
        title="FGO Tools"
        description="Fate/Grand Order Tools by Mitsunee"
        noTitleSuffix
      />
      <CardGrid>
        <Card color="blue" title="Join on Discord">
          Image goes here
        </Card>
        <Card color="gold" title="Support on Github">
          Another Image here
        </Card>
      </CardGrid>
      <Headline>Credits</Headline>
      <Section background>
        <ul>
          <li>
            Made by{" "}
            <a
              href="https://twitter.com/mitsunee"
              target="_blank"
              rel="noopener noreferrer">
              Mitsunee
            </a>
          </li>
          <li>
            &ldquo;Fate/Grand Order&rdquo; is a trademark of Notes Co., Ltd.
          </li>
          <li>Game Assets &copy; Aniplex Inc. used under fair use.</li>
          <li>
            <a
              href="https://atlasacademy.io/"
              target="_blank"
              rel="noopener noreferrer">
              Atlas Academy
            </a>{" "}
            for their Game Data API
          </li>
          <li>
            <a
              href="https://github.com/spencermountain/spacetime"
              target="_blank"
              rel="noopener noreferrer">
              Spacetime
            </a>{" "}
            for timezone conversion
          </li>
        </ul>
      </Section>
    </>
  );
}
