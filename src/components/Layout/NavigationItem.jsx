import Link from "next/link";

import styles from "./NavigationItem.module.css";
import Svg from "@components/Svg";

export default function NavigationItem({
  children,
  link,
  active,
  className = false
}) {
  return active ? (
    <span
      className={
        className
          ? `${styles.link} ${styles.active} ${className}`
          : `${styles.link} ${styles.active}`
      }>
      <Svg viewBox="0 0 520 520" className={styles.svg}>
        <path
          // ./assets/chaldea.svg
          d="m 83.549049,7.0253906 c 0,0 -46.140846,55.7948874 -46.140846,55.6796874 0,-0.1152 17.337891,21.119141 17.337891,21.119141 l -17.103516,21.177731 45.902344,55.73828 46.525388,-55.73828 c 0,0 -17.49123,-21.167966 -17.54883,-21.167966 -0.0608,0 12.74997,-15.374964 12.86837,-15.259764 0.032,0.0352 -2.04307,-2.687928 -5.18868,-6.335939 -3.27681,-3.792011 -7.21557,-7.327518 -9.48437,-11.519531 -2.78081,-5.846417 1.33789,-10.179687 1.33789,-10.179688 L 110.42578,39.140625 93.146484,60.087891 83.544922,48.859375 61.4375,75.447266 50.791016,62.705078 c 0,0 32.815633,-39.27465 32.758033,-39.15625 -0.0608,0.1152 11.343529,13.789063 11.343529,13.789063 L 96.8125,35.476562 c 0,0 -5.874848,-6.439498 -7.564453,-12.103515 -1.187204,-3.984012 1.628906,-7.794922 1.628906,-7.794922 z M 100.7168,58.292969 c 1.9808,-0.457602 3.83984,1.800781 3.83984,1.800781 l 7.47852,8.480469 c 0,0 -6.24707,6.864312 -6.28547,6.864312 -0.0416,0 -10.751643,-13.067437 -10.751643,-13.067437 0,0 3.043542,-3.457323 5.718753,-4.078125 z m -17.167972,7.044922 c 0,0 15.802657,18.15625 15.722656,18.15625 -0.08,0 -15.644609,18.775389 -15.724609,18.775389 -0.08,0 -15.015625,-18.777342 -15.015625,-18.777342 z M 106.0293,92.019531 116.62109,104.66992 83.548828,144.14258 50.978516,104.66992 61.308594,92.339844 83.548828,118.58008 Z"
          transform="matrix(3.1249907,0,0,3.1249907,0.01026218,-1.0427955)"
        />
      </Svg>
      {children}
    </span>
  ) : (
    <Link href={link} passHref>
      <a className={className ? `${styles.link} ${className}` : styles.link}>
        {children}
      </a>
    </Link>
  );
}
