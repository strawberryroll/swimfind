import type { PoolStatusInput, TodayFreeSwimmingStatus } from "./pool.types";

const WEEKDAY_MAP = {
  일: "SUN",
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
} as const;

function getKoreaDateTime(now: Date) {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    dayOfWeek: WEEKDAY_MAP[parts.weekday as keyof typeof WEEKDAY_MAP],
  };
}

/**
 * 오늘 자유수영 상태를 계산합니다.
 *
 * 우선순위:
 * 1. 특정 날짜 휴관
 * 2. 자유수영 미운영 / 미확인
 * 3. 정기 휴관 여부
 * 4. 오늘 자유수영 일정 존재 여부
 * 5. 자유수영 회차 또는 운영시간 확인
 */
export function calculateTodayFreeSwimmingStatus(
  detail: PoolStatusInput,
  now = new Date(),
): TodayFreeSwimmingStatus {
  const { date, time, dayOfWeek } = getKoreaDateTime(now);

  const closure = detail.closures.find((item) => item.closureDate === date);

  if (closure) {
    return "CLOSED";
  }

  if (detail.pool.freeSwimmingStatus === "NOT_OPERATED") {
    return "NOT_OPERATED";
  }

  if (detail.pool.freeSwimmingStatus === "UNKNOWN") {
    return "UNVERIFIED";
  }

  const operatingHour = detail.operatingHours.find(
    (item) => item.dayOfWeek === dayOfWeek,
  );

  if (operatingHour?.isClosed) {
    return "CLOSED";
  }

  const todaySchedules = detail.schedules.filter((schedule) => {
    if (schedule.status !== "ACTIVE") {
      return false;
    }

    if (schedule.dayOfWeek !== dayOfWeek) {
      return false;
    }

    if (schedule.startDate && date < schedule.startDate) {
      return false;
    }

    if (schedule.endDate && date > schedule.endDate) {
      return false;
    }

    return true;
  });

  if (todaySchedules.length === 0) {
    // 일정이 없다는 사실만으로 해당 요일의 미운영이 확인된 것은 아닙니다.
    return "UNVERIFIED";
  }

  const scheduleIds = todaySchedules.map((schedule) => schedule.id);

  const todaySessions = detail.sessions.filter((session) =>
    scheduleIds.includes(session.scheduleId),
  );

  // 옹암체육센터처럼 자유수영 회차가 정해진 경우
  if (todaySessions.length > 0) {
    const hasRemainingSession = todaySessions.some(
      (session) => time < session.endTime,
    );

    return hasRemainingSession ? "AVAILABLE" : "ENDED";
  }

  // 동남스포피아처럼 별도 회차 없이 운영시간 동안 이용하는 경우
  if (!operatingHour?.closeTime) {
    return "UNVERIFIED";
  }

  return time < operatingHour.closeTime ? "AVAILABLE" : "ENDED";
}
