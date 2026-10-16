import { describe, expect, it } from "vitest";
import type { PoolCardData } from "./pool.types";
import { countAvailablePools, filterPools, sortPools } from "./pool-list";

const pools: PoolCardData[] = [
  {
    id: 1,
    name: "다 수영장",
    todayStatus: "AVAILABLE",
    region: "서울",
    distanceKm: 5,
    adultDailyPrice: 5000,
  },
  {
    id: 2,
    name: "가 수영장",
    todayStatus: "ENDED",
    region: "서울",
    distanceKm: 1,
    adultDailyPrice: 6000,
  },
  {
    id: 3,
    name: "나 수영장",
    todayStatus: "AVAILABLE",
    region: "경기",
    distanceKm: 3,
    adultDailyPrice: 0,
  },
  {
    id: 4,
    name: "라 수영장",
    todayStatus: "UNVERIFIED",
    region: "경기",
    adultDailyPrice: null,
  },
];

const ids = (list: PoolCardData[]) => list.map((pool) => pool.id);

describe("filterPools", () => {
  it("조건이 없으면 전부 남긴다", () => {
    expect(
      ids(filterPools(pools, { availableOnly: false, region: "" })),
    ).toEqual([1, 2, 3, 4]);
  });

  it("이용 가능만 선택하면 AVAILABLE만 남긴다", () => {
    expect(
      ids(filterPools(pools, { availableOnly: true, region: "" })),
    ).toEqual([1, 3]);
  });

  it("지역을 고르면 해당 지역만 남긴다", () => {
    expect(
      ids(filterPools(pools, { availableOnly: false, region: "경기" })),
    ).toEqual([3, 4]);
  });

  it("두 조건을 함께 적용한다", () => {
    expect(
      ids(filterPools(pools, { availableOnly: true, region: "서울" })),
    ).toEqual([1]);
  });

  it("맞는 수영장이 없으면 빈 배열을 반환한다", () => {
    expect(
      filterPools(pools, { availableOnly: false, region: "부산" }),
    ).toEqual([]);
  });
});

describe("countAvailablePools", () => {
  it("AVAILABLE인 수영장 수를 센다", () => {
    expect(countAvailablePools(pools)).toBe(2);
  });
});

describe("sortPools", () => {
  it("거리순: 가까운 순, 거리 없음은 뒤", () => {
    expect(ids(sortPools(pools, "DISTANCE"))).toEqual([2, 3, 1, 4]);
  });

  it("가격순: 낮은 순, 0원이 먼저, 요금 미확인은 뒤", () => {
    expect(ids(sortPools(pools, "PRICE"))).toEqual([3, 1, 2, 4]);
  });

  it("이름순: 가나다 순", () => {
    expect(ids(sortPools(pools, "NAME"))).toEqual([2, 3, 1, 4]);
  });

  it("이용 가능 우선: AVAILABLE을 앞으로, 나머지는 원래 순서", () => {
    expect(ids(sortPools(pools, "AVAILABLE_FIRST"))).toEqual([1, 3, 2, 4]);
  });

  it("원본 배열을 바꾸지 않는다", () => {
    sortPools(pools, "NAME");
    expect(ids(pools)).toEqual([1, 2, 3, 4]);
  });
});
