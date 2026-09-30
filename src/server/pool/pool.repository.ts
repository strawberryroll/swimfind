import { eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import {
  freeSwimmingPrices,
  freeSwimmingSchedules,
  freeSwimmingSessions,
  poolClosures,
  poolOperatingHours,
  pools,
} from "@/server/db/schema";

/**
 * 활성 상태인 수영장 목록을 조회합니다.
 * 홈/검색 결과 화면에서 사용할 기본 정보만 반환합니다.
 */
export async function getPools() {
  return db
    .select({
      id: pools.id,
      name: pools.name,
      address: pools.address,
      latitude: pools.latitude,
      longitude: pools.longitude,
      status: pools.status,
      freeSwimmingStatus: pools.freeSwimmingStatus,
      freeSwimmingNote: pools.freeSwimmingNote,
    })
    .from(pools)
    .where(eq(pools.status, "ACTIVE"))
    .orderBy(pools.id);
}

/**
 * 특정 수영장의 상세 정보를 조회합니다.
 *
 * 함께 조회하는 정보:
 * - 수영장 기본 정보
 * - 운영시간
 * - 자유수영 일정
 * - 자유수영 회차
 * - 특정 날짜 휴관/운영 예외
 * - 자유수영 요금
 */
export async function getPoolById(poolId: number) {
  const [pool] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, poolId))
    .limit(1);

  if (!pool) {
    return null;
  }

  const operatingHours = await db
    .select()
    .from(poolOperatingHours)
    .where(eq(poolOperatingHours.poolId, poolId));

  const schedules = await db
    .select()
    .from(freeSwimmingSchedules)
    .where(eq(freeSwimmingSchedules.poolId, poolId));

  const scheduleIds = schedules.map((schedule) => schedule.id);

  const sessions =
    scheduleIds.length === 0
      ? []
      : await db
          .select()
          .from(freeSwimmingSessions)
          .where(inArray(freeSwimmingSessions.scheduleId, scheduleIds));

  const closures = await db
    .select()
    .from(poolClosures)
    .where(eq(poolClosures.poolId, poolId));

  const prices = await db
    .select()
    .from(freeSwimmingPrices)
    .where(eq(freeSwimmingPrices.poolId, poolId));

  return {
    pool,
    operatingHours,
    schedules,
    sessions,
    closures,
    prices,
  };
}
