// UI 검토용 예시 데이터다. 실제 수영장·일정·요금이 아니다.
// 이름은 가상이고 id는 실제 수영장과 겹치지 않게 9001부터 쓴다. 단계 5에서 실제 조회로 교체한다.
// 이미지(public/mock)는 Figma 시안에서 가져온 임시 이미지다. 단계 10에서 mock과 함께 삭제한다.

import type { PoolCardData } from "../pool.types";

export const POOL_CARD_MOCKS: PoolCardData[] = [
  // 이용 가능: 모든 정보가 있는 기본 사례
  {
    id: 9001,
    name: "예시 수영장 A",
    todayStatus: "AVAILABLE",
    nextSession: { startTime: "14:00:00", endTime: "17:00:00" },
    entryCloseTime: "16:30:00",
    adultDailyPrice: 4000,
    regionLabel: "예시시 가구",
    distanceKm: 2.4,
    imageUrl: "/mock/pool-1.jpg",
  },
  // 이용 가능: 입장 마감이 없는 회차
  {
    id: 9002,
    name: "예시 수영장 B",
    todayStatus: "AVAILABLE",
    nextSession: { startTime: "15:30:00", endTime: "17:30:00" },
    entryCloseTime: null,
    adultDailyPrice: 5000,
    regionLabel: "예시시 나구",
    distanceKm: 5.1,
    imageUrl: "/mock/pool-2.jpg",
  },
  // 이용 가능: 요금 기록이 없고 관심 수영장으로 저장된 사례
  {
    id: 9003,
    name: "예시 수영장 C",
    todayStatus: "AVAILABLE",
    nextSession: { startTime: "16:00:00", endTime: "18:00:00" },
    entryCloseTime: "17:30:00",
    adultDailyPrice: null,
    regionLabel: "예시시 다구",
    distanceKm: 12.3,
    isFavorite: true,
    imageUrl: "/mock/pool-3.jpg",
  },
  // 오늘 자유수영 종료
  {
    id: 9004,
    name: "예시 수영장 D",
    todayStatus: "ENDED",
    nextSession: null,
    adultDailyPrice: 3500,
    regionLabel: "예시시 가구",
    distanceKm: 3.9,
    imageUrl: "/mock/pool-1.jpg",
  },
  // 휴관(오늘 이용 불가)
  {
    id: 9005,
    name: "예시 수영장 E",
    todayStatus: "CLOSED",
    nextSession: null,
    adultDailyPrice: 4000,
    regionLabel: "예시시 라구",
    distanceKm: 8.7,
    imageUrl: "/mock/pool-2.jpg",
  },
  // 정보 미확인: 시간과 요금을 모른다. 이용 불가가 아니다.
  {
    id: 9006,
    name: "예시 수영장 F",
    todayStatus: "UNVERIFIED",
    regionLabel: "예시시 마구",
    distanceKm: 6.2,
  },
  // 오늘 자유수영 일정 없음
  {
    id: 9007,
    name: "예시 수영장 G",
    todayStatus: "NO_SCHEDULE",
    nextSession: null,
    adultDailyPrice: 4500,
    regionLabel: "예시시 나구",
    distanceKm: 9.8,
    imageUrl: "/mock/pool-3.jpg",
  },
  // 자유수영 미운영
  {
    id: 9008,
    name: "예시 수영장 H",
    todayStatus: "NOT_OPERATED",
    nextSession: null,
    adultDailyPrice: null,
    regionLabel: "예시시 바구",
    distanceKm: 15,
  },
  // 위치 권한이 없어 거리가 없고, 요금이 0원으로 기록된 사례
  {
    id: 9009,
    name: "예시 수영장 I",
    todayStatus: "AVAILABLE",
    nextSession: { startTime: "17:00:00", endTime: "19:00:00" },
    entryCloseTime: "18:30:00",
    adultDailyPrice: 0,
    regionLabel: "예시시 사구",
    imageUrl: "/mock/pool-1.jpg",
  },
];
