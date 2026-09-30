import { and, eq, inArray } from "drizzle-orm";

import { db } from "../index";
import {
  freeSwimmingPrices,
  freeSwimmingSchedules,
  freeSwimmingSessions,
  poolOperatingHours,
  pools,
} from "../schema";

const VERIFIED_AT = new Date("2026-09-28T00:00:00+09:00");

async function seedPools() {
  await db.transaction(async (tx) => {
    async function seedAngelCrew() {
      const existingPool = await tx
        .select({ id: pools.id })
        .from(pools)
        .where(
          and(
            eq(pools.name, "엔젤크루어린이수영장 인천인하점"),
            eq(pools.address, "인천 미추홀구 소성로 6 1층 XGY17호"),
          ),
        )
        .limit(1);

      let poolId: number;

      if (existingPool[0]) {
        poolId = existingPool[0].id;

        await tx
          .update(pools)
          .set({
            latitude: 37.4472348588633,
            longitude: 126.6507762,
            status: "ACTIVE",
            freeSwimmingStatus: "NOT_OPERATED",
            freeSwimmingVerifiedAt: VERIFIED_AT,
            freeSwimmingNote: "자유수영 미운영",
            infoVerifiedAt: VERIFIED_AT,
          })
          .where(eq(pools.id, poolId));
      } else {
        const [createdPool] = await tx
          .insert(pools)
          .values({
            name: "엔젤크루어린이수영장 인천인하점",
            address: "인천 미추홀구 소성로 6 1층 XGY17호",
            latitude: 37.4472348588633,
            longitude: 126.6507762,
            status: "ACTIVE",
            freeSwimmingStatus: "NOT_OPERATED",
            freeSwimmingVerifiedAt: VERIFIED_AT,
            freeSwimmingNote: "자유수영 미운영",
            infoVerifiedAt: VERIFIED_AT,
          })
          .returning({ id: pools.id });

        if (!createdPool) {
          throw new Error("엔젤크루 수영장 생성 실패");
        }

        poolId = createdPool.id;
      }

      await tx
        .delete(poolOperatingHours)
        .where(eq(poolOperatingHours.poolId, poolId));

      await tx.insert(poolOperatingHours).values([
        {
          poolId,
          dayOfWeek: "MON",
          openTime: "09:00:00",
          closeTime: "22:00:00",
          verifiedAt: VERIFIED_AT,
        },
        {
          poolId,
          dayOfWeek: "TUE",
          openTime: "09:00:00",
          closeTime: "22:00:00",
          verifiedAt: VERIFIED_AT,
        },
        {
          poolId,
          dayOfWeek: "WED",
          openTime: "09:00:00",
          closeTime: "22:00:00",
          verifiedAt: VERIFIED_AT,
        },
        {
          poolId,
          dayOfWeek: "THU",
          openTime: "09:00:00",
          closeTime: "22:00:00",
          verifiedAt: VERIFIED_AT,
        },
        {
          poolId,
          dayOfWeek: "FRI",
          openTime: "09:00:00",
          closeTime: "22:00:00",
          verifiedAt: VERIFIED_AT,
        },
        {
          poolId,
          dayOfWeek: "SAT",
          openTime: "09:00:00",
          closeTime: "16:00:00",
          verifiedAt: VERIFIED_AT,
        },
        {
          poolId,
          dayOfWeek: "SUN",
          openTime: "09:00:00",
          closeTime: "16:00:00",
          verifiedAt: VERIFIED_AT,
        },
      ]);
    }

    async function seedDongnam() {
      const existingPool = await tx
        .select({ id: pools.id })
        .from(pools)
        .where(
          and(
            eq(pools.name, "동남스포피아수영장"),
            eq(pools.address, "인천 연수구 새말로 27 B1"),
          ),
        )
        .limit(1);

      let poolId: number;

      if (existingPool[0]) {
        poolId = existingPool[0].id;

        await tx
          .update(pools)
          .set({
            latitude: 37.42387009999999,
            longitude: 126.6749132,
            status: "ACTIVE",
            freeSwimmingStatus: "OPERATED",
            freeSwimmingNote:
              "월~토 자유수영 운영. 이용 시간은 일반 운영시간 전체.",
          })
          .where(eq(pools.id, poolId));
      } else {
        const [createdPool] = await tx
          .insert(pools)
          .values({
            name: "동남스포피아수영장",
            address: "인천 연수구 새말로 27 B1",
            latitude: 37.42387009999999,
            longitude: 126.6749132,
            status: "ACTIVE",
            freeSwimmingStatus: "OPERATED",
            freeSwimmingNote:
              "월~토 자유수영 운영. 이용 시간은 일반 운영시간 전체.",
          })
          .returning({ id: pools.id });

        if (!createdPool) {
          throw new Error("동남스포피아 수영장 생성 실패");
        }

        poolId = createdPool.id;
      }

      await tx
        .delete(poolOperatingHours)
        .where(eq(poolOperatingHours.poolId, poolId));

      await tx.insert(poolOperatingHours).values([
        {
          poolId,
          dayOfWeek: "MON",
          openTime: "06:00:00",
          closeTime: "21:00:00",
        },
        {
          poolId,
          dayOfWeek: "TUE",
          openTime: "06:00:00",
          closeTime: "21:00:00",
        },
        {
          poolId,
          dayOfWeek: "WED",
          openTime: "06:00:00",
          closeTime: "21:00:00",
        },
        {
          poolId,
          dayOfWeek: "THU",
          openTime: "06:00:00",
          closeTime: "21:00:00",
        },
        {
          poolId,
          dayOfWeek: "FRI",
          openTime: "06:00:00",
          closeTime: "21:00:00",
        },
        {
          poolId,
          dayOfWeek: "SAT",
          openTime: "06:00:00",
          closeTime: "18:00:00",
        },
        {
          poolId,
          dayOfWeek: "SUN",
          isClosed: true,
        },
      ]);

      const oldSchedules = await tx
        .select({ id: freeSwimmingSchedules.id })
        .from(freeSwimmingSchedules)
        .where(eq(freeSwimmingSchedules.poolId, poolId));

      const oldScheduleIds = oldSchedules.map((schedule) => schedule.id);

      if (oldScheduleIds.length > 0) {
        await tx
          .delete(freeSwimmingSessions)
          .where(inArray(freeSwimmingSessions.scheduleId, oldScheduleIds));

        await tx
          .delete(freeSwimmingSchedules)
          .where(eq(freeSwimmingSchedules.poolId, poolId));
      }

      const schedules = await tx
        .insert(freeSwimmingSchedules)
        .values(
          (["MON", "TUE", "WED", "THU", "FRI", "SAT"] as const).map(
            (dayOfWeek) => ({
              poolId,
              dayOfWeek,
              status: "ACTIVE" as const,
            }),
          ),
        )
        .returning({
          id: freeSwimmingSchedules.id,
          dayOfWeek: freeSwimmingSchedules.dayOfWeek,
        });

      await tx.insert(freeSwimmingSessions).values(
        schedules.map((schedule) => ({
          scheduleId: schedule.id,
          startTime: "06:00:00",
          endTime: schedule.dayOfWeek === "SAT" ? "18:00:00" : "21:00:00",
        })),
      );

      await tx
        .delete(freeSwimmingPrices)
        .where(eq(freeSwimmingPrices.poolId, poolId));

      await tx.insert(freeSwimmingPrices).values([
        {
          poolId,
          priceType: "DAILY",
          targetType: "ADULT",
          amount: 14000,
        },
        {
          poolId,
          priceType: "DAILY",
          targetType: "CHILD",
          amount: 13000,
        },
      ]);
    }

    async function seedOngam() {
      const existingPool = await tx
        .select({ id: pools.id })
        .from(pools)
        .where(
          and(
            eq(pools.name, "옹암체육센터"),
            eq(pools.address, "인천 연수구 비류대로 142"),
          ),
        )
        .limit(1);

      let poolId: number;

      if (existingPool[0]) {
        poolId = existingPool[0].id;

        await tx
          .update(pools)
          .set({
            latitude: 37.4291877,
            longitude: 126.6501538,
            status: "ACTIVE",
            freeSwimmingStatus: "OPERATED",
            freeSwimmingNote:
              "수영복, 수경, 수모, 샤워용품, 수건 준비. 패들, 스노클, 오리발 사용 불가.",
          })
          .where(eq(pools.id, poolId));
      } else {
        const [createdPool] = await tx
          .insert(pools)
          .values({
            name: "옹암체육센터",
            address: "인천 연수구 비류대로 142",
            latitude: 37.4291877,
            longitude: 126.6501538,
            status: "ACTIVE",
            freeSwimmingStatus: "OPERATED",
            freeSwimmingNote:
              "수영복, 수경, 수모, 샤워용품, 수건 준비. 패들, 스노클, 오리발 사용 불가.",
          })
          .returning({ id: pools.id });

        if (!createdPool) {
          throw new Error("옹암체육센터 생성 실패");
        }

        poolId = createdPool.id;
      }

      await tx
        .delete(poolOperatingHours)
        .where(eq(poolOperatingHours.poolId, poolId));

      await tx.insert(poolOperatingHours).values([
        ...(["MON", "TUE", "WED", "THU", "FRI"] as const).map((dayOfWeek) => ({
          poolId,
          dayOfWeek,
          openTime: "06:00:00",
          closeTime: "21:00:00",
        })),
        {
          poolId,
          dayOfWeek: "SAT" as const,
          openTime: "09:00:00",
          closeTime: "17:00:00",
        },
        {
          poolId,
          dayOfWeek: "SUN" as const,
          isClosed: true,
        },
      ]);

      /*
       * 기존 자유수영 회차와 일정을 제거한 뒤
       * 최신 seed 데이터로 다시 생성합니다.
       */
      const oldSchedules = await tx
        .select({ id: freeSwimmingSchedules.id })
        .from(freeSwimmingSchedules)
        .where(eq(freeSwimmingSchedules.poolId, poolId));

      const oldScheduleIds = oldSchedules.map((schedule) => schedule.id);

      if (oldScheduleIds.length > 0) {
        await tx
          .delete(freeSwimmingSessions)
          .where(inArray(freeSwimmingSessions.scheduleId, oldScheduleIds));

        await tx
          .delete(freeSwimmingSchedules)
          .where(eq(freeSwimmingSchedules.poolId, poolId));
      }

      const weekdaySchedules = await tx
        .insert(freeSwimmingSchedules)
        .values(
          (["MON", "TUE", "WED", "THU", "FRI"] as const).map((dayOfWeek) => ({
            poolId,
            dayOfWeek,
            status: "ACTIVE" as const,
          })),
        )
        .returning({
          id: freeSwimmingSchedules.id,
          dayOfWeek: freeSwimmingSchedules.dayOfWeek,
        });

      const [saturdaySchedule] = await tx
        .insert(freeSwimmingSchedules)
        .values({
          poolId,
          dayOfWeek: "SAT",
          status: "ACTIVE",
        })
        .returning({
          id: freeSwimmingSchedules.id,
        });

      if (!saturdaySchedule) {
        throw new Error("옹암체육센터 토요일 자유수영 일정 생성 실패");
      }

      for (const schedule of weekdaySchedules) {
        await tx.insert(freeSwimmingSessions).values([
          {
            scheduleId: schedule.id,
            startTime: "08:00:00",
            endTime: "08:50:00",
          },
          {
            scheduleId: schedule.id,
            startTime: "14:00:00",
            endTime: "14:50:00",
          },
          {
            scheduleId: schedule.id,
            startTime: "15:00:00",
            endTime: "15:50:00",
          },
          {
            scheduleId: schedule.id,
            startTime: "18:00:00",
            endTime: "18:50:00",
          },
        ]);
      }

      await tx.insert(freeSwimmingSessions).values([
        {
          scheduleId: saturdaySchedule.id,
          startTime: "09:00:00",
          endTime: "11:50:00",
          eligibilityNote: "선착순 70명",
        },
        {
          scheduleId: saturdaySchedule.id,
          startTime: "14:00:00",
          endTime: "16:50:00",
          eligibilityNote: "선착순 70명",
        },
      ]);

      await tx
        .delete(freeSwimmingPrices)
        .where(eq(freeSwimmingPrices.poolId, poolId));

      await tx.insert(freeSwimmingPrices).values([
        {
          poolId,
          priceType: "DAILY",
          targetType: "ADULT",
          amount: 4500,
        },
        {
          poolId,
          priceType: "DAILY",
          targetType: "YOUTH",
          amount: 4000,
        },
        {
          poolId,
          priceType: "DAILY",
          targetType: "CHILD",
          amount: 3500,
        },
        {
          poolId,
          priceType: "MONTHLY",
          targetType: "ADULT",
          amount: 50000,
        },
        {
          poolId,
          priceType: "MONTHLY",
          targetType: "YOUTH",
          amount: 40000,
        },
        {
          poolId,
          priceType: "MONTHLY",
          targetType: "CHILD",
          amount: 35000,
        },
      ]);
    }

    await seedAngelCrew();
    await seedDongnam();
    await seedOngam();
  });

  console.log("수영장 seed 데이터 입력 완료!");
}

seedPools()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("수영장 seed 데이터 입력 실패!");
    console.error(error);
    process.exit(1);
  });
