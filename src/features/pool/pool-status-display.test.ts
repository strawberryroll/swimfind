import { describe, expect, it } from "vitest";

import {
  getPoolStatusDisplay,
  POOL_STATUS_DISPLAY,
} from "./pool-status-display";

const ALL_STATUSES = [
  "AVAILABLE",
  "ENDED",
  "CLOSED",
  "NO_SCHEDULE",
  "NOT_OPERATED",
  "UNVERIFIED",
] as const;

describe("POOL_STATUS_DISPLAY", () => {
  it("모든 오늘 상태에 표시 정보가 있다", () => {
    for (const status of ALL_STATUSES) {
      const display = getPoolStatusDisplay(status);
      expect(display.label).not.toBe("");
      expect(display.timeFallback).not.toBe("");
    }
  });

  it("이용 가능만 success tone이다", () => {
    const successStatuses = ALL_STATUSES.filter(
      (status) => POOL_STATUS_DISPLAY[status].tone === "success",
    );
    expect(successStatuses).toEqual(["AVAILABLE"]);
  });

  it("정보 미확인을 이용 불가처럼 표현하지 않는다", () => {
    const unverified = getPoolStatusDisplay("UNVERIFIED");
    const closed = getPoolStatusDisplay("CLOSED");

    expect(unverified.tone).not.toBe(closed.tone);
    expect(unverified.label).not.toContain("불가");
    expect(unverified.timeFallback).not.toContain("이용할 수 없");
  });

  it("각 상태의 문구가 서로 다르다", () => {
    const labels = ALL_STATUSES.map(
      (status) => POOL_STATUS_DISPLAY[status].label,
    );
    expect(new Set(labels).size).toBe(ALL_STATUSES.length);
  });
});
