"use client";

import { Button } from "@/components/ui/Button/Button";
import { MapPinIcon } from "@/components/ui/icons/MapPinIcon";

export function CurrentLocationButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        // 임시: 위치 권한 요청과 주변 탐색은 단계 6에서 구현한다.
        alert("현재 위치 기능은 준비 중입니다.");
      }}
    >
      <MapPinIcon size={16} />
      현재 위치
    </Button>
  );
}
