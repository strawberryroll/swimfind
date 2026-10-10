/** "14:00:00" → "14:00". 초가 없는 "14:00"은 그대로 둔다. */
export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)}~${formatTime(endTime)}`;
}

/** 입장 마감 시각이 없으면 표시하지 않는다. */
export function formatEntryCloseTime(
  entryCloseTime: string | null | undefined,
): string | null {
  return entryCloseTime ? `입장 마감 ${formatTime(entryCloseTime)}` : null;
}

/** 기록이 없는 요금은 무료가 아니라 미확인이다. 0원으로 기록된 경우만 무료로 표시한다. */
export function formatAdultPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return "요금 정보 미확인";
  }
  if (price === 0) {
    return "성인 무료";
  }
  return `성인 ${price.toLocaleString("ko-KR")}원`;
}

export function formatDistance(distanceKm: number): string {
  return `${Math.round(distanceKm * 10) / 10}km`;
}

/** 지역과 거리 중 있는 값만 " · "로 이어 붙인다. 둘 다 없으면 null이다. */
export function formatLocation(
  regionLabel: string | undefined,
  distanceKm: number | undefined,
): string | null {
  const parts = [
    regionLabel,
    distanceKm === undefined ? undefined : formatDistance(distanceKm),
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : null;
}
