// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.

import type {
  FreeSwimmingSession,
  Pool,
  TodayFreeSwimmingStatus,
} from "@/server/pool/pool.types";

export type PoolCardSession = Pick<
  FreeSwimmingSession,
  "startTime" | "endTime"
>;

/** 홈·검색 결과·관심 목록에서 쓰는 수영장 카드 데이터 */
export type PoolCardData = {
  id: Pool["id"];
  name: Pool["name"];
  /** 오늘 상태는 화면에서 계산하지 않고 Service 결과를 쓴다. */
  todayStatus: TodayFreeSwimmingStatus;
  /** [필요 필드: service] 다음 또는 진행 중인 회차. 목록 조회에서 계산한다. */
  nextSession?: PoolCardSession | null;
  /** [필요 필드: service] 오늘 남은 회차 수 */
  remainingSessionCount?: number;
  /** [필요 필드: service] 다음 회차의 입장 마감 시각. 값이 없으면 표시하지 않는다. */
  entryCloseTime?: FreeSwimmingSession["entryCloseTime"];
  /** [필요 필드: service] 성인 일일 요금(원). 기록이 없으면 무료가 아니라 미확인이다. */
  adultDailyPrice?: number | null;
  /** [필요 필드: schema] 지역 라벨(예: "인천 미추홀구"). 지금은 주소 문자열만 있다. */
  regionLabel?: string;
  /** [필요 필드: service] 현재 위치 기준 거리(km). 위치 권한이 필요하다. */
  distanceKm?: number;
  /** [필요 필드: service] 대표 이미지 URL. pool_images는 object key만 저장한다. */
  imageUrl?: string | null;
  /** [필요 필드: schema] 로그인 사용자의 관심 여부. favorites 테이블이 없다. */
  isFavorite?: boolean;
};
