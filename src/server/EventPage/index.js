import { readStaticBundle } from "src/server/utils/static";

export async function getStaticPaths() {
  const events = await readStaticBundle("events");
  const paths = events.map(({ slug }) => ({ params: { slug } }));

  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const events = await readStaticBundle("events");
  const event = events.find(({ slug }) => slug === context.params.slug);

  if (!event) return { notFound: true };

  if (event.description) {
    event.description = event.description.trim().split("\n");
  }

  // NOTE: possibly implement autohiding for times here in the future?

  return { props: event };
}
