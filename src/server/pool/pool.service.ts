import {
  getPoolById as getPoolByIdFromRepository,
  getPools as getPoolsFromRepository,
} from "./pool.repository";
import { calculateTodayFreeSwimmingStatus } from "./pool-status";

/**
 * 활성 상태인 수영장 목록을 조회합니다.
 */
export async function getPools() {
  return getPoolsFromRepository();
}

/**
 * 특정 수영장 상세 정보와 오늘 자유수영 상태를 반환합니다.
 */
export async function getPoolById(poolId: number) {
  const detail = await getPoolByIdFromRepository(poolId);

  if (!detail) {
    return null;
  }

  return {
    ...detail,
    todayStatus: calculateTodayFreeSwimmingStatus(detail),
  };
}
