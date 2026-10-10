import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/Card/Card";
import { ClockIcon } from "@/components/ui/icons/ClockIcon";
import { MapPinIcon } from "@/components/ui/icons/MapPinIcon";
import { WaveIcon } from "@/components/ui/icons/WaveIcon";

import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { PoolStatusBadge } from "../PoolStatusBadge/PoolStatusBadge";
import type { PoolCardData } from "../pool.types";
import {
  formatAdultPrice,
  formatEntryCloseTime,
  formatLocation,
  formatTimeRange,
} from "../pool-format";
import { getPoolStatusDisplay } from "../pool-status-display";
import styles from "./PoolCard.module.css";

type PoolCardProps = {
  pool: PoolCardData;
  className?: string;
  /** 화면 첫 줄처럼 스크롤 없이 보이는 카드는 이미지를 바로 불러온다. */
  eagerImage?: boolean;
};

/** 홈·관심 목록에서 쓰는 세로형 수영장 카드. 오늘 상태는 계산하지 않고 받은 값을 표시한다. */
export function PoolCard({
  pool,
  className,
  eagerImage = false,
}: PoolCardProps) {
  const { timeFallback } = getPoolStatusDisplay(pool.todayStatus);
  const location = formatLocation(pool.regionLabel, pool.distanceKm);
  const session = pool.nextSession;
  const metaText = [
    formatAdultPrice(pool.adultDailyPrice),
    session ? formatEntryCloseTime(pool.entryCloseTime) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className={clsx(styles.card, className)}>
      <div className={styles.imageArea}>
        {pool.imageUrl ? (
          <>
            <Image
              src={pool.imageUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 100vw"
              loading={eagerImage ? "eager" : "lazy"}
              className={styles.image}
            />
            <div className={styles.imageOverlay} aria-hidden="true" />
          </>
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <WaveIcon className={styles.placeholderIcon} />
          </div>
        )}
        <PoolStatusBadge status={pool.todayStatus} className={styles.badge} />
        <div className={styles.favorite}>
          <FavoriteButton poolName={pool.name} isFavorite={pool.isFavorite} />
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link href={`/pools/${pool.id}`} className={styles.link}>
            {pool.name}
          </Link>
        </h3>
        {location && (
          <p className={styles.location}>
            <MapPinIcon className={styles.locationIcon} />
            <span>{location}</span>
          </p>
        )}
        <div className={styles.info}>
          <p className={styles.time}>
            {session ? (
              <>
                <ClockIcon className={styles.timeIcon} />
                <span>
                  {formatTimeRange(session.startTime, session.endTime)}
                </span>
              </>
            ) : (
              <span className={styles.timeFallback}>{timeFallback}</span>
            )}
          </p>
          <p className={clsx(styles.meta, session && styles.metaIndented)}>
            {metaText}
          </p>
        </div>
      </div>
    </Card>
  );
}
