import type { TodayFreeSwimmingStatus } from "@/server/pool/pool.types";

export type PoolStatusTone = "success" | "warning" | "danger" | "neutral";

export type PoolStatusDisplay = {
  label: string;
  tone: PoolStatusTone;
  /** 상태 점을 함께 표시할지 여부 */
  dot: boolean;
  /** 이용 시간을 보여줄 수 없을 때 시간 자리에 쓰는 안내 문구 */
  timeFallback: string;
};

/**
 * 오늘 상태를 화면 표현으로 바꾼다. 상태 자체는 계산하지 않고 Service 결과를 받는다.
 * 정보 미확인(UNVERIFIED)을 이용 불가(CLOSED)와 구분해서 표현한다.
 */
export const POOL_STATUS_DISPLAY = {
  AVAILABLE: {
    label: "오늘 이용 가능",
    tone: "success",
    dot: true,
    timeFallback: "이용 시간은 상세에서 확인해 주세요",
  },
  ENDED: {
    label: "오늘 자유수영 종료",
    tone: "neutral",
    dot: false,
    timeFallback: "오늘 이용 가능한 시간이 끝났어요",
  },
  CLOSED: {
    label: "오늘 이용 불가",
    tone: "danger",
    dot: true,
    timeFallback: "오늘은 이용할 수 없어요",
  },
  NO_SCHEDULE: {
    label: "오늘 자유수영 일정 없음",
    tone: "neutral",
    dot: false,
    timeFallback: "오늘은 자유수영 일정이 없어요",
  },
  NOT_OPERATED: {
    label: "자유수영 미운영",
    tone: "neutral",
    dot: false,
    timeFallback: "자유수영을 운영하지 않아요",
  },
  UNVERIFIED: {
    label: "오늘 자유수영 정보 미확인",
    tone: "warning",
    dot: false,
    timeFallback: "운영 시간 확인이 필요해요",
  },
} satisfies Record<TodayFreeSwimmingStatus, PoolStatusDisplay>;

export function getPoolStatusDisplay(
  status: TodayFreeSwimmingStatus,
): PoolStatusDisplay {
  return POOL_STATUS_DISPLAY[status];
}
