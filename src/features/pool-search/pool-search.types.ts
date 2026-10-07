// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.
//
// URL `searchParams`와의 변환은 단계 5에서 연결한다.

export type PoolSearchSort = "AVAILABLE_FIRST" | "DISTANCE" | "PRICE" | "NAME";

/** `/pools` 검색 조건 */
export type PoolSearchParams = {
  /** 수영장 이름 또는 지역 검색어 */
  q?: string;
  /** [필요 필드: schema] 지역 값. DB에 지역 컬럼이 없고 지역 목록도 확정되지 않았다. */
  region?: string;
  /** 오늘 이용 가능한 수영장만 */
  availableToday?: boolean;
  /** 원하는 시간대(회차 시작 시간 기준). "HH:mm" */
  startTimeFrom?: string;
  startTimeTo?: string;
  /** 현재 위치 기준 최대 거리(km). null이면 제한 없음 */
  maxDistanceKm?: number | null;
  /** 최대 가격(원) */
  maxPrice?: number;
  sort?: PoolSearchSort;
};
