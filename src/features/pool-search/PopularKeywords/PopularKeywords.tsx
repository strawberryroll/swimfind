"use client";

import { useRouter } from "next/navigation";

import { Chip } from "@/components/ui/Chip/Chip";

import { POPULAR_KEYWORDS_MOCK } from "../mocks/search-options.mock";
import styles from "./PopularKeywords.module.css";

export function PopularKeywords() {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <span id="popular-keywords-label" className={styles.label}>
        인기 키워드
      </span>
      <ul className={styles.list} aria-labelledby="popular-keywords-label">
        {POPULAR_KEYWORDS_MOCK.map((keyword) => (
          <li key={keyword}>
            <Chip
              tone="overlay"
              size="sm"
              onClick={() =>
                router.push(`/pools?q=${encodeURIComponent(keyword)}`)
              }
            >
              #{keyword}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}
