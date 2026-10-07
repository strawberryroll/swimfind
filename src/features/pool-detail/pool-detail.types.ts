// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.
//
// 오늘 상태·일정·회차·요금·휴관은 기존 `PoolDetailResult`(`@/server/pool/pool.types`)를 그대로 쓴다.
// 이 파일은 `PoolDetailResult`에 없는 상세 보조 영역만 정의한다.
//
// [필요 필드: schema] 가격 대상: Figma에는 "장애인·유공자(증빙 서류 필요)"가 있지만
// DB enum(free_swimming_target_type)은 ADULT·YOUTH·CHILD뿐이다.
// 나이 범위·조건 문구를 가격 note로 표현할지도 정해야 한다.

import type { ReviewItem, ReviewSummary } from "@/features/review/review.types";
import type { FreeSwimmingSession } from "@/server/pool/pool.types";

export type PoolImageView = {
  id: number;
  url: string;
  alt?: string;
  isPrimary: boolean;
};

/** 시설 정보 탭의 수영장 정보와 이용 조건 */
export type PoolSpecs = {
  laneCount?: number;
  laneLengthM?: number;
  waterTempC?: number;
  depthMinM?: number;
  depthMaxM?: number;
  /** 예: "무료 200대" */
  parking?: string;
  /** 이용 조건 문구. 예: "1인 1레인 기준" */
  conditions?: string[];
};

export type PoolEquipment = {
  name: string;
  /** false이면 사용 제한이다(취소선으로 표시). */
  isAllowed: boolean;
};

export type PoolFaqItem = {
  id: number;
  question: string;
  answer: string;
};

export type PoolLessonClass = {
  id: number;
  name: string;
  /** 예: "월·수·금 · 07:00~08:00" */
  scheduleLabel: string;
  coachName?: string;
  capacity: number;
  enrolled: number;
  /** 월 수강료(원) */
  monthlyPrice: number;
};

/** 회차별 표시 상태. 일정 계산은 Service가 하고 화면은 결과만 표시한다. */
export type PoolSessionDisplayStatus = "ENDED" | "AVAILABLE";

/** `PoolDetailResult`에 없는 상세 화면 보조 데이터 */
export type PoolDetailExtras = {
  /** [필요 필드: schema] 지역 라벨(예: "인천 미추홀구") */
  regionLabel?: string;
  /** [필요 필드: service] 현재 위치 기준 거리(km) */
  distanceKm?: number;
  /** [필요 필드: schema] 로그인 사용자의 관심 여부 */
  isFavorite?: boolean;
  /** [필요 필드: schema] 상세 태그(예: "성인 자유수영", "현장 발권", "수영모 필착") */
  tags?: string[];
  /** [필요 필드: service] 이미지 목록. pool_images는 object key만 저장한다. */
  images?: PoolImageView[];
  /** [필요 필드: service] 회차별 표시 상태. key는 `FreeSwimmingSession["id"]` */
  sessionStatusById?: Record<
    FreeSwimmingSession["id"],
    PoolSessionDisplayStatus
  >;
  /** [필요 필드: schema] 레인 수·수온 등 컬럼이 없다. facilities는 type·description만 가진다. */
  specs?: PoolSpecs;
  /** [필요 필드: schema] 장비 이용 가능 여부. facilities 구조로 표현할지 정해야 한다. */
  equipment?: PoolEquipment[];
  /** [필요 필드: schema] FAQ 테이블이 없다. */
  faqs?: PoolFaqItem[];
  /** [필요 필드: schema] 강습 정보 테이블이 없다. */
  lessons?: PoolLessonClass[];
  /** [필요 필드: schema] 강습 등록·문의 안내 문구 */
  lessonNote?: string;
  /** [필요 필드: schema] reviews 테이블이 없다. */
  reviewSummary?: ReviewSummary;
  recentReviews?: ReviewItem[];
};
