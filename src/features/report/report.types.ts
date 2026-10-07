// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.

import type { Pool } from "@/server/pool/pool.types";

export type PoolReportType =
  | "FREE_SWIMMING_TIME"
  | "PRICE"
  | "CLOSURE"
  | "FACILITY"
  | "UNREGISTERED_POOL"
  | "OTHER";

/** [필요 필드: schema] 처리 상태 값은 임시다. database.md는 status 필드만 정의한다. */
export type PoolReportStatus = "PENDING" | "APPROVED" | "REJECTED";

/** 정보 수정 제보 입력. 미등록 수영장은 `NewPoolRequestDraft`를 쓴다. */
export type PoolReportDraft = {
  poolId: Pool["id"];
  type: Exclude<PoolReportType, "UNREGISTERED_POOL">;
  suggestedValue: string;
  sourceUrl?: string;
};

/** 미등록 수영장 등록 요청 입력 */
export type NewPoolRequestDraft = {
  name: string;
  address: string;
  homepageUrl?: string;
  sourceUrl?: string;
};

/** 내 제보 목록과 운영자 검토에서 쓰는 제보 */
export type PoolReportItem = {
  id: number;
  /** 미등록 수영장 등록 요청이면 null */
  poolId: Pool["id"] | null;
  /** [필요 필드: service] 목록 표시용 수영장 이름. pool_id로 조회해 채운다. */
  poolName?: string;
  type: PoolReportType;
  status: PoolReportStatus;
  suggestedValue: string;
  sourceUrl?: string | null;
  /** 운영자 메모. 제보자에게 공개할지는 정해지지 않았다. */
  adminNote?: string | null;
  /** [필요 필드: schema] 접수일. 설계 필드에 접수 시각이 없다. ISO 날짜 문자열 */
  createdAt?: string;
};
