// UI 검토용 예시 데이터이다. 실제 지역 목록·인기 키워드 집계가 아니다.
// 지역 목록은 단계 5에서 확정하고, 인기 키워드는 집계 기능이 정해지면 교체한다.

export const REGION_OPTIONS_MOCK = [
  { value: "", label: "전체" },
  { value: "서울", label: "서울" },
  { value: "경기", label: "경기" },
  { value: "인천", label: "인천" },
  { value: "부산", label: "부산" },
  { value: "대구", label: "대구" },
  { value: "대전", label: "대전" },
  { value: "광주", label: "광주" },
  { value: "울산", label: "울산" },
  { value: "세종", label: "세종" },
] as const;

export const POPULAR_KEYWORDS_MOCK = [
  "자유수영",
  "새벽수영",
  "오전수영",
  "직장인 수영",
] as const;
