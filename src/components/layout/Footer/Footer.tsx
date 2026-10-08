import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.name}>SwimFind</p>
        <p className={styles.description}>
          오늘 갈 수 있는 수영장을 빠르게 찾는 서비스입니다.
        </p>
        <p className={styles.copyright}>
          © 2026 SwimFind. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
