// 수영장 목록의 필터·정렬 규칙이다. UI 검토용 mock 목록에 쓰며, 단계 5에서 서버 조회로 교체한다.
// 오늘 상태는 계산하지 않고 `todayStatus`를 그대로 쓴다.

import type { PoolSearchSort } from "@/features/pool-search/pool-search.types";

import type { PoolCardData } from "./pool.types";

export type PoolListFilter = {
  /** true면 오늘 이용 가능한 수영장만 남긴다. */
  availableOnly: boolean;
  /** 빈 문자열이면 지역 전체 */
  region: string;
};

export function filterPools(
  pools: PoolCardData[],
  { availableOnly, region }: PoolListFilter,
): PoolCardData[] {
  return pools.filter((pool) => {
    if (availableOnly && pool.todayStatus !== "AVAILABLE") return false;
    if (region !== "" && pool.region !== region) return false;
    return true;
  });
}

export function countAvailablePools(pools: PoolCardData[]): number {
  return pools.filter((pool) => pool.todayStatus === "AVAILABLE").length;
}

/** 값이 없는 항목은 뒤로 보낸다. */
function compareOptionalNumber(
  a: number | null | undefined,
  b: number | null | undefined,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
}

/** 원본을 바꾸지 않고 정렬한 새 배열을 반환한다. 같은 값은 원래 순서를 유지한다. */
export function sortPools(
  pools: PoolCardData[],
  sort: PoolSearchSort,
): PoolCardData[] {
  const sorted = [...pools];

  switch (sort) {
    case "DISTANCE":
      return sorted.sort((a, b) =>
        compareOptionalNumber(a.distanceKm, b.distanceKm),
      );
    case "PRICE":
      return sorted.sort((a, b) =>
        compareOptionalNumber(a.adultDailyPrice, b.adultDailyPrice),
      );
    case "NAME":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    case "AVAILABLE_FIRST":
      return sorted.sort(
        (a, b) =>
          Number(b.todayStatus === "AVAILABLE") -
          Number(a.todayStatus === "AVAILABLE"),
      );
  }
}
