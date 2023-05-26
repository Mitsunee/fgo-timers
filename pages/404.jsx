import Headline from "@components/Headline";
import Meta from "@components/Meta";

export default function Error404Page() {
  return (
    <>
      <Meta title="Error 404" description="Page not found" isError />
      <Headline>Error 404</Headline>
      <p>This page could not be found or has been removed</p>
    </>
  );
}
