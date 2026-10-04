import { describe, expect, it } from "vitest";

import type { PoolStatusInput } from "./pool.types";
import { calculateTodayFreeSwimmingStatus } from "./pool-status";

const MONDAY_MORNING = new Date("2026-09-28T07:00:00+09:00");

function createDetail(): PoolStatusInput {
  return {
    pool: {
      freeSwimmingStatus: "OPERATED" as const,
    },
    operatingHours: [
      {
        dayOfWeek: "MON",
        openTime: "06:00:00",
        closeTime: "21:00:00",
        isClosed: false,
      },
    ],
    schedules: [
      {
        id: 1,
        dayOfWeek: "MON",
        startDate: null,
        endDate: null,
        status: "ACTIVE" as const,
      },
    ],
    sessions: [],
    closures: [],
  };
}

describe("calculateTodayFreeSwimmingStatus", () => {
  it("특정 날짜가 휴관일이면 CLOSED를 반환한다", () => {
    const detail = createDetail();

    detail.closures.push({
      closureDate: "2026-09-28",
    });

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("CLOSED");
  });

  it("자유수영을 운영하지 않으면 NOT_OPERATED를 반환한다", () => {
    const detail = createDetail();

    detail.pool.freeSwimmingStatus = "NOT_OPERATED";

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("NOT_OPERATED");
  });

  it("자유수영 운영 여부가 미확인이면 UNVERIFIED를 반환한다", () => {
    const detail = createDetail();

    detail.pool.freeSwimmingStatus = "UNKNOWN";

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("UNVERIFIED");
  });

  it("자유수영 일정 정보가 없으면 UNVERIFIED를 반환한다", () => {
    const detail = createDetail();

    detail.schedules = [];

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("UNVERIFIED");
  });

  it("다른 요일의 일정만 있으면 UNVERIFIED를 반환한다", () => {
    const detail = createDetail();

    detail.schedules[0].dayOfWeek = "TUE";

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("UNVERIFIED");
  });

  it("비활성 일정만 있으면 UNVERIFIED를 반환한다", () => {
    const detail = createDetail();

    detail.schedules[0].status = "INACTIVE";

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("UNVERIFIED");
  });

  it.each([
    { startDate: "2026-09-29", endDate: null },
    { startDate: null, endDate: "2026-09-27" },
  ])("오늘이 일정 적용 기간 밖이면 UNVERIFIED를 반환한다: %o", (period) => {
    const detail = createDetail();

    Object.assign(detail.schedules[0], period);

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("UNVERIFIED");
  });

  it("오늘 일정이 없어도 정기 휴관이 확인되면 CLOSED를 반환한다", () => {
    const detail = createDetail();

    detail.schedules = [];
    detail.operatingHours[0].isClosed = true;
    detail.operatingHours[0].openTime = null;
    detail.operatingHours[0].closeTime = null;

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("CLOSED");
  });

  it("오늘 정기 휴관이면 CLOSED를 반환한다", () => {
    const detail = createDetail();

    detail.operatingHours[0].isClosed = true;
    detail.operatingHours[0].openTime = null;
    detail.operatingHours[0].closeTime = null;

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("CLOSED");
  });

  it("남아 있는 자유수영 회차가 있으면 AVAILABLE을 반환한다", () => {
    const detail = createDetail();

    detail.sessions.push({
      scheduleId: 1,
      startTime: "08:00:00",
      endTime: "08:50:00",
    });

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("AVAILABLE");
  });

  it("모든 자유수영 회차가 끝났으면 ENDED를 반환한다", () => {
    const detail = createDetail();

    detail.sessions.push({
      scheduleId: 1,
      startTime: "08:00:00",
      endTime: "08:50:00",
    });

    const afterSession = new Date("2026-09-28T09:00:00+09:00");

    const result = calculateTodayFreeSwimmingStatus(detail, afterSession);
    expect(result).toBe("ENDED");
  });

  it("회차가 없는 자유수영은 운영시간이 남아 있으면 AVAILABLE을 반환한다", () => {
    const detail = createDetail();

    const result = calculateTodayFreeSwimmingStatus(detail, MONDAY_MORNING);
    expect(result).toBe("AVAILABLE");
  });

  it("회차가 없는 자유수영은 운영시간이 끝났으면 ENDED를 반환한다", () => {
    const detail = createDetail();

    const afterClosing = new Date("2026-09-28T22:00:00+09:00");

    const result = calculateTodayFreeSwimmingStatus(detail, afterClosing);
    expect(result).toBe("ENDED");
  });
});
