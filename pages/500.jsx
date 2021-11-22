import Meta from "@components/Meta";
import Headline from "@components/Headline";

export default function Error500Page() {
  return (
    <>
      <Meta title="Error 500" description="Server Error" isError />
      <Headline>Error 500</Headline>
      <p>Internal Server Error</p>
    </>
  );
}
