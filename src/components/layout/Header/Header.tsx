import Link from "next/link";

import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/pools", label: "수영장 찾기" },
  { href: "/favorites", label: "관심 수영장" },
  { href: "/my", label: "마이페이지" },
] as const;

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          SwimFind
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/login" className={styles.login}>
          로그인
        </Link>
      </div>
    </header>
  );
}
