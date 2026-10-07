// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.

export type ReviewAuthor = {
  id: number;
  nickname: string;
  /** [필요 필드: schema] 사용자 프로필 이미지. 사용자 모델이 아직 없다. */
  profileImageUrl?: string | null;
};

/**
 * [필요 필드: schema] 평점 척도가 정해지지 않았다. 1~5 점수로 가정한다.
 * 혼잡도는 실시간 현황이 아니라 방문자의 방문 당시 경험이다.
 */
export type ReviewRatings = {
  cleanliness: number;
  facility: number;
  congestion: number;
};

export type ReviewImage = {
  id: number;
  url: string;
  altText?: string | null;
  sortOrder: number;
};

export type ReviewItem = {
  id: number;
  author: ReviewAuthor;
  content: string;
  /** 방문일. ISO 날짜 문자열(예: "2026-09-20") */
  visitedAt: string;
  /** [필요 필드: schema] 방문 회차 라벨(예: "18:30~20:30 회차"). 설계에는 방문일만 있다. */
  sessionLabel?: string;
  /** [필요 필드: schema] reviews 테이블이 아직 없다. */
  ratings?: ReviewRatings;
  /** [필요 필드: schema] 후기 태그(예: "깨끗", "한산") */
  tags?: string[];
  /** 후기당 최대 5장 */
  images?: ReviewImage[];
};

export type ReviewSummary = {
  count: number;
  /** [필요 필드: service] 평균 평점은 후기 집계가 필요하다. */
  averageCleanliness?: number;
  averageFacility?: number;
  averageCongestion?: number;
};
