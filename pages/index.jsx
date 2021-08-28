// import Head from 'next/head'
// import Image from 'next/image'

// import styles from '@styles/Home.module.css'
import Meta from "@components/Meta";

export default function Home() {
  return (
    <>
      <Meta title="FGO Tools" description="BOTTOM TEXT" noTitleSuffix />
      {Array(100)
        .fill(0)
        .map((_, idx) => (
          <div key={idx}>{idx}</div>
        ))}
    </>
  );
}
