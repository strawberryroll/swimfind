import Image from "next/image";

import { PoolSearchForm } from "../PoolSearchForm/PoolSearchForm";
import { PopularKeywords } from "../PopularKeywords/PopularKeywords";
import styles from "./PoolSearchHero.module.css";

export function PoolSearchHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      {/* 임시: Figma 시안 이미지이다. 단계 10에서 public/mock과 함께 삭제한다. */}
      <Image
        src="/mock/hero.jpg"
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="home-hero-title" className={styles.title}>
          오늘 어디에서 수영할까요?
        </h1>
        <p className={styles.description}>
          오늘의 자유수영 정보를 확인하고 갈 수 있는 수영장을 찾아보세요.
        </p>
        <PoolSearchForm />
        <PopularKeywords />
      </div>
    </section>
  );
}
