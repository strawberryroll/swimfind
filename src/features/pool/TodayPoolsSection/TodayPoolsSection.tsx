"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge/Badge";
import { buttonVariants } from "@/components/ui/Button/Button.variants";
import { Chip } from "@/components/ui/Chip/Chip";
import { Select } from "@/components/ui/Select/Select";
import { REGION_OPTIONS_MOCK } from "@/features/pool-search/mocks/search-options.mock";
import type { PoolSearchSort } from "@/features/pool-search/pool-search.types";

import { PoolCard } from "../PoolCard/PoolCard";
import type { PoolCardData } from "../pool.types";
import { countAvailablePools, filterPools, sortPools } from "../pool-list";
import styles from "./TodayPoolsSection.module.css";

const SORT_OPTIONS: { value: PoolSearchSort; label: string }[] = [
  { value: "DISTANCE", label: "거리순" },
  { value: "AVAILABLE_FIRST", label: "이용 가능 우선" },
  { value: "PRICE", label: "가격순" },
  { value: "NAME", label: "이름순" },
];

type TodayPoolsSectionProps = {
  pools: PoolCardData[];
};

/** 홈의 "오늘 갈 수 있는 수영장" 섹션. 필터·정렬은 받은 목록 안에서만 한다. */
export function TodayPoolsSection({ pools }: TodayPoolsSectionProps) {
  const [availableOnly, setAvailableOnly] = useState(true);
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState<PoolSearchSort>("DISTANCE");

  const visiblePools = sortPools(
    filterPools(pools, { availableOnly, region }),
    sort,
  );

  return (
    <section className={styles.section} aria-labelledby="today-pools-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{"TODAY'S POOLS"}</p>
            <div className={styles.titleRow}>
              <h2 id="today-pools-title" className={styles.title}>
                오늘 갈 수 있는 수영장
              </h2>
              <Badge tone="success" appearance="soft" dot>
                {countAvailablePools(pools)}곳 이용 가능
              </Badge>
            </div>
          </div>
          <div className={styles.controls}>
            <div className={styles.segmented}>
              <Chip
                selected={availableOnly}
                onClick={() => setAvailableOnly(true)}
              >
                이용 가능만
              </Chip>
              <Chip
                selected={!availableOnly}
                onClick={() => setAvailableOnly(false)}
              >
                전체
              </Chip>
            </div>
            <Select
              shape="pill"
              aria-label="정렬"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as PoolSearchSort)
              }
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </header>

        <ul className={styles.regions} aria-label="지역">
          {REGION_OPTIONS_MOCK.map((option) => (
            <li key={option.value}>
              <Chip
                selected={region === option.value}
                onClick={() => setRegion(option.value)}
              >
                {option.label}
              </Chip>
            </li>
          ))}
        </ul>

        {/* 필터·정렬 결과 변경을 스크린리더에 알린다. */}
        <p className={styles.srOnly} aria-live="polite">
          {visiblePools.length}곳 표시
        </p>

        {visiblePools.length > 0 ? (
          <ul className={styles.grid}>
            {visiblePools.map((pool) => (
              <li key={pool.id}>
                <PoolCard pool={pool} />
              </li>
            ))}
          </ul>
        ) : (
          // 임시 문구다. 빈 목록 상태 UI는 #38에서 만든다.
          <p className={styles.empty}>조건에 맞는 수영장 없음</p>
        )}

        <div className={styles.more}>
          <Link
            href="/pools"
            className={buttonVariants({ variant: "secondary" })}
          >
            더 많은 수영장 찾아보기
          </Link>
        </div>
      </div>
    </section>
  );
}
