"use client";

import clsx from "clsx";

import { HeartFilledIcon } from "@/components/ui/icons/HeartFilledIcon";
import { HeartIcon } from "@/components/ui/icons/HeartIcon";

import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
  poolName: string;
  isFavorite?: boolean;
  className?: string;
};

export function FavoriteButton({
  poolName,
  isFavorite = false,
  className,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      aria-label={`${poolName} 관심 수영장`}
      aria-pressed={isFavorite}
      onClick={() => {
        // 임시: 관심 저장은 단계 7에서 구현한다. Toast를 만들면 교체한다.
        alert("관심 수영장 기능은 준비 중입니다.");
      }}
    >
      {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
    </button>
  );
}
