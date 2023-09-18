import Meta from "~/components/Meta";
import Section from "~/components/Section";

export default function HomePage() {
  return (
    <>
      <Meta
        title="FGO Timers"
        description="So this is goodbye, I guess. As of 18th of September 2023 I am no
        longer maintaining FGO Timers..."
        headerDescription="Announcement"
        noTitleSuffix
      />
      <Section background="black">
        <p>
          So this is goodbye, I guess. As of 18th of September 2023 I am no
          longer maintaining FGO Timers. This site has been my biggest project
          and I{"'"}ve been building and maintaing it mostly by myself since
          2019.
        </p>
        <p>
          I should probably mention Atlas Academy who graciously let me use
          their API and CDN for game data and assets all this time. This site
          would never have gotten most of the features if it wasn{"'"}t for
          their help, especially Cereal who kept helping me even after I left
          their discord server due to disagreements that I don{"'"}t want to
          mention further here.
        </p>
        <p>
          All that said, I have chosen to stop working on and updating this
          site. While I did manage to automate some things entirely (Login
          Exchange Tickets, Upgrades, Master Misisons) to make them update
          alongside any other changes I deploy, keeping Events (the main feature
          of the site judging by the amount of Speed Benchmark datapoints) and
          Shops up to date is not something I want to keep doing. This will also
          mean the automated parts of the site will cease updating and I have
          disabled page regeneration for the few pages that did use the feature.
        </p>
        <p>
          Adding new features to the site has honestly been an exhausting
          experience every time, and is usually not a thankful one either. It is
          very clear the events pages were over 90% of the usage of this site.
          Having to deal with increasingly complex systems I{"'"}ve had to build
          to keep things somewhat optimized and easy to deal with as the site
          grew beyond the table of countdowns it started as has honestly
          spiraled entirely out of what a single person can manage for a hobby
          project.
        </p>
        <p>
          This has been a difficult decision (that I{"'"}ve actually avoided
          taking multiple times before) but I want to take a step back from
          development, maybe (re)discover some other passions or work on smaller
          projects here or there.
        </p>
        <p>
          Thank you to everyone who has been supporting me all this time like my
          friends, people in my discord server (which is staying around btw, no
          reason to close that) and the few people I have seen sharing my site
          elsewhere.
        </p>
      </Section>
    </>
  );
}
