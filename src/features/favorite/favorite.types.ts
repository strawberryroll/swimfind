// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.

import type { PoolCardData } from "@/features/pool/pool.types";

/** 관심 목록의 수영장. 저장 당시가 아니라 현재의 오늘 상태를 표시한다. */
export type FavoritePoolItem = PoolCardData & {
  /** [필요 필드: schema] 저장 시각. favorites 테이블이 없다. ISO 날짜 문자열 */
  savedAt?: string;
};

export type FavoriteFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";

export type FavoriteSort = "STATUS" | "DISTANCE" | "NAME";

/** 필터 탭에 표시하는 개수 */
export type FavoriteFilterCounts = Record<FavoriteFilter, number>;

export type FavoriteSummary = {
  totalCount: number;
  availableTodayCount: number;
};
