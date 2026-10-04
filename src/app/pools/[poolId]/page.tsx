import { notFound } from "next/navigation";
import { getPoolById } from "@/server/pool/pool.service";
import type { TodayFreeSwimmingStatus } from "@/server/pool/pool.types";

const PRICE_TYPES = [
  { value: "DAILY", label: "일일 요금" },
  { value: "MONTHLY", label: "월 이용료" },
] as const;

const TARGET_LABELS = {
  ADULT: "성인",
  YOUTH: "청소년",
  CHILD: "어린이",
} as const;

const DAYS_OF_WEEK = [
  { value: "MON", label: "월요일" },
  { value: "TUE", label: "화요일" },
  { value: "WED", label: "수요일" },
  { value: "THU", label: "목요일" },
  { value: "FRI", label: "금요일" },
  { value: "SAT", label: "토요일" },
  { value: "SUN", label: "일요일" },
] as const;

const STATUS_LABELS = {
  AVAILABLE: "오늘 이용 가능",
  ENDED: "오늘 자유수영 종료",
  CLOSED: "오늘 이용 불가",
  NO_SCHEDULE: "오늘 자유수영 일정 없음",
  NOT_OPERATED: "자유수영 미운영",
  UNVERIFIED: "오늘 자유수영 정보 미확인",
} satisfies Record<TodayFreeSwimmingStatus, string>;

export default async function PoolDetailPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await params;
  const id = Number(poolId);

  if (
    !/^[1-9]\d*$/.test(poolId) ||
    !Number.isInteger(id) ||
    id > 2_147_483_647
  ) {
    notFound();
  }

  const detail = await getPoolById(id);
  if (!detail) {
    notFound();
  }

  const sessionsByDay = detail.schedules.map((schedule) => ({
    dayOfWeek: schedule.dayOfWeek,
    sessions: detail.sessions.filter(
      (session) => session.scheduleId === schedule.id,
    ),
  }));

  return (
    <main>
      <h1>{detail.pool.name}</h1>
      <p>{detail.pool.address}</p>
      <p>오늘 자유수영 상태: {STATUS_LABELS[detail.todayStatus]}</p>

      <section>
        <h2>자유수영 안내</h2>
        <p>{detail.pool.freeSwimmingNote ?? "안내 정보가 없습니다."}</p>
      </section>

      <section>
        <h2>이용 요금</h2>
        {detail.prices.length === 0 ? (
          <p>요금 정보 미확인</p>
        ) : (
          PRICE_TYPES.map(({ value, label }) => {
            const prices = detail.prices.filter(
              (price) => price.priceType === value,
            );

            if (prices.length === 0) {
              return null;
            }

            return (
              <div key={value}>
                <h3>{label}</h3>
                <ul>
                  {prices.map((price) => (
                    <li key={price.id}>
                      {TARGET_LABELS[price.targetType]}:{" "}
                      {price.amount.toLocaleString("ko-KR")}원
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      <section>
        <h2>자유수영 시간</h2>

        {sessionsByDay.map(({ dayOfWeek, sessions }) => (
          <div key={dayOfWeek}>
            <h3>
              {DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label}
            </h3>

            {sessions.length > 0 ? (
              <ul>
                {sessions.map((session) => (
                  <li key={session.id}>
                    {session.startTime.slice(0, 5)} ~{" "}
                    {session.endTime.slice(0, 5)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>별도 회차 없이 운영시간 내 이용 가능합니다.</p>
            )}
          </div>
        ))}
      </section>
      <section>
        <h2>수영장 운영시간</h2>
        <ul>
          {DAYS_OF_WEEK.map(({ value, label }) => {
            const operatingHour = detail.operatingHours.find(
              (hour) => hour.dayOfWeek === value,
            );

            let timeLabel = "운영시간 미확인";

            if (operatingHour?.isClosed) {
              timeLabel = "휴관";
            } else if (operatingHour?.openTime && operatingHour.closeTime) {
              timeLabel = `${operatingHour.openTime.slice(0, 5)} ~ ${operatingHour.closeTime.slice(0, 5)}`;
            }

            return (
              <li key={value}>
                {label}: {timeLabel}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
