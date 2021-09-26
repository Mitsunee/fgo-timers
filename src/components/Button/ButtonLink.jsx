import Link from "next/link";

import styles from "./ButtonLink.module.css";

export default function ButtonLink({
  children,
  href,
  targetBlank,
  nextLink,
  className = "",
  ...props
}) {
  const commonProps = {
    className: `${styles.link} ${className}`.trim(),
    ...props
  };

  // ignores targetBlank
  if (nextLink) {
    return (
      <Link href={href}>
        <a {...commonProps}>{children}</a>
      </Link>
    );
  }

  if (targetBlank) {
    return (
      <a href={href} {...commonProps} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <a {...commonProps}>{children}</a>;
}
