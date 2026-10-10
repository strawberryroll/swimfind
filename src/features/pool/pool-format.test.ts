import { describe, expect, it } from "vitest";

import {
  formatAdultPrice,
  formatDistance,
  formatEntryCloseTime,
  formatLocation,
  formatTime,
  formatTimeRange,
} from "./pool-format";

describe("formatTime", () => {
  it("초를 제외한 HH:MM으로 바꾼다", () => {
    expect(formatTime("14:00:00")).toBe("14:00");
  });

  it("이미 HH:MM이면 그대로 둔다", () => {
    expect(formatTime("09:05")).toBe("09:05");
  });
});

describe("formatTimeRange", () => {
  it("시작과 종료 시각을 ~로 잇는다", () => {
    expect(formatTimeRange("14:00:00", "17:00:00")).toBe("14:00~17:00");
  });
});

describe("formatEntryCloseTime", () => {
  it("값이 있으면 입장 마감 문구를 만든다", () => {
    expect(formatEntryCloseTime("16:30:00")).toBe("입장 마감 16:30");
  });

  it("값이 없으면 표시하지 않는다", () => {
    expect(formatEntryCloseTime(null)).toBeNull();
    expect(formatEntryCloseTime(undefined)).toBeNull();
  });
});

describe("formatAdultPrice", () => {
  it("천 단위 쉼표를 붙인다", () => {
    expect(formatAdultPrice(4000)).toBe("성인 4,000원");
  });

  it("0원으로 기록된 경우에만 무료로 표시한다", () => {
    expect(formatAdultPrice(0)).toBe("성인 무료");
  });

  it("기록이 없으면 무료가 아니라 미확인이다", () => {
    expect(formatAdultPrice(null)).toBe("요금 정보 미확인");
    expect(formatAdultPrice(undefined)).toBe("요금 정보 미확인");
    expect(formatAdultPrice(null)).not.toContain("무료");
  });
});

describe("formatDistance", () => {
  it("소수점 한 자리까지 표시한다", () => {
    expect(formatDistance(2.4)).toBe("2.4km");
    expect(formatDistance(12.34)).toBe("12.3km");
  });

  it("정수 거리는 소수점을 붙이지 않는다", () => {
    expect(formatDistance(5)).toBe("5km");
  });
});

describe("formatLocation", () => {
  it("지역과 거리를 함께 표시한다", () => {
    expect(formatLocation("인천 미추홀구", 2.4)).toBe("인천 미추홀구 · 2.4km");
  });

  it("거리가 없으면 지역만 표시한다", () => {
    expect(formatLocation("인천 미추홀구", undefined)).toBe("인천 미추홀구");
  });

  it("지역이 없으면 거리만 표시한다", () => {
    expect(formatLocation(undefined, 2.4)).toBe("2.4km");
  });

  it("둘 다 없으면 null이다", () => {
    expect(formatLocation(undefined, undefined)).toBeNull();
  });
});
