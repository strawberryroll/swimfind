// UI 검토용 임시 타입이다. 단계 5에서 실제 타입으로 교체한다.
// DB schema·API 응답을 확정하지 않는다. `[필요 필드]` 표시는 단계 4에서 목록으로 모은다.
//
// 로그인 전후 화면 확인용 mock 사용자 타입이다. 실제 세션 모델은 단계 7에서 설계한다.

export type ViewerRole = "GUEST" | "MEMBER" | "ADMIN";

export type AppUser = {
  id: number;
  nickname: string;
  /** [필요 필드: schema] 사용자 프로필 이미지. 사용자 모델이 아직 없다. */
  profileImageUrl?: string | null;
};

/** 현재 화면을 보는 사용자. 비로그인은 사용자 정보가 없다. */
export type Viewer =
  | { role: "GUEST" }
  | { role: "MEMBER" | "ADMIN"; user: AppUser };
