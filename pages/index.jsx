// import Head from 'next/head'
// import Image from 'next/image'

// import styles from '@styles/Home.module.css'
import Meta from "@components/Meta";
import Headline from "@components/Headline";
import Section from "@components/Section";

export default function Home() {
  return (
    <>
      <Meta title="FGO Tools" description="BOTTOM TEXT" noTitleSuffix />
      <Headline>FGO Tools</Headline>
      <Section background>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus
          molestie nunc non blandit massa enim nec dui nunc. Nisl nunc mi ipsum
          faucibus vitae aliquet nec ullamcorper. Semper viverra nam libero
          justo laoreet sit. Aliquam sem et tortor consequat id porta. Egestas
          erat imperdiet sed euismod nisi porta lorem mollis. Euismod lacinia at
          quis risus sed vulputate odio. Amet nisl suscipit adipiscing bibendum
          est ultricies integer. Diam maecenas ultricies mi eget mauris pharetra
          et. Id semper risus in hendrerit gravida rutrum quisque non tellus.
          Quam quisque id diam vel quam. Semper risus in hendrerit gravida
          rutrum quisque non tellus. Pellentesque diam volutpat commodo sed
          egestas. Justo laoreet sit amet cursus sit. Aenean vel elit
          scelerisque mauris pellentesque pulvinar.
        </p>
      </Section>
      <Headline>PLACEHOLDER</Headline>
      <Section padding>
        <p>
          Ipsum consequat nisl vel pretium lectus quam id. Fermentum leo vel
          orci porta non. Neque ornare aenean euismod elementum nisi. Euismod
          nisi porta lorem mollis aliquam ut. Consectetur adipiscing elit ut
          aliquam purus sit amet luctus. Magna fringilla urna porttitor rhoncus
          dolor. Faucibus in ornare quam viverra orci sagittis eu. Pretium fusce
          id velit ut tortor pretium. Pellentesque diam volutpat commodo sed.
          Nisi lacus sed viverra tellus. Laoreet sit amet cursus sit. Sapien nec
          sagittis aliquam malesuada bibendum arcu. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Lectus proin nibh nisl
          condimentum id.
        </p>
      </Section>
      <Section background>
        <p>
          Blandit aliquam etiam erat velit. Eget nulla facilisi etiam dignissim
          diam quis enim lobortis. Sit amet est placerat in egestas erat
          imperdiet sed. Vitae ultricies leo integer malesuada nunc vel risus
          commodo viverra. Urna neque viverra justo nec ultrices dui sapien
          eget. Tempor orci dapibus ultrices in iaculis nunc. Pharetra et
          ultrices neque ornare aenean euismod elementum. Tincidunt lobortis
          feugiat vivamus at augue. Aenean pharetra magna ac placerat vestibulum
          lectus mauris. Donec et odio pellentesque diam volutpat commodo sed
          egestas. Facilisi etiam dignissim diam quis enim lobortis.
        </p>
      </Section>
      <Section background="blue">
        <p>
          I&apos;d just like to interject for a moment. What you&apos;re
          refering to as Linux, is in fact, GNU/Linux, or as I&apos;ve recently
          taken to calling it, GNU plus Linux. Linux is not an operating system
          unto itself, but rather another free component of a fully functioning
          GNU system made useful by the GNU corelibs, shell utilities and vital
          system components comprising a full OS as defined by POSIX.
        </p>
        <p>
          Many computer users run a modified version of the GNU system every
          day, without realizing it. Through a peculiar turn of events, the
          version of GNU which is widely used today is often called Linux, and
          many of its users are not aware that it is basically the GNU system,
          developed by the GNU Project.
        </p>
        <p>
          There really is a Linux, and these people are using it, but it is just
          a part of the system they use. Linux is the kernel: the program in the
          system that allocates the machine&apos;s resources to the other
          programs that you run. The kernel is an essential part of an operating
          system, but useless by itself; it can only function in the context of
          a complete operating system. Linux is normally used in combination
          with the GNU operating system: the whole system is basically GNU with
          Linux added, or GNU/Linux. All the so-called Linux distributions are
          really distributions of GNU/Linux!
        </p>
      </Section>
    </>
  );
}
