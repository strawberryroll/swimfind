# SwimFind Database Design

SwimFind의 데이터 모델, 자유수영 상태 계산 기준,
Drizzle schema 작성 원칙, migration 규칙을 정의한다.

DB 또는 Repository, Service의 데이터 처리 방식을 변경할 때
이 문서를 먼저 확인한다.

실제 구현과 문서가 충돌하는 경우
현재 적용된 Drizzle schema와 migration 상태를 우선 확인하고,
임의로 기존 migration을 수정하지 않는다.

---

## 1. Core Principles

SwimFind 데이터 모델은 다음 원칙을 따른다.

- 수영장 일반 운영시간과 자유수영 시간을 분리한다.
- 정기 자유수영 일정과 특정 날짜의 임시 휴관/운영 변경을 분리한다.
- 임시 예외는 정기 일정보다 우선한다.
- 자유수영 운영 여부와 오늘 이용 가능 상태를 구분한다.
- 정보가 없는 것과 이용할 수 없는 것을 구분한다.
- 확인되지 않은 값은 추측해서 저장하지 않는다.
- 공통 이용 조건을 모든 회차에 반복 저장하지 않는다.
- 사용자 제보는 운영자 검토 없이 공식 데이터에 자동 반영하지 않는다.
- DB는 원본 데이터를 저장하고,
  오늘 이용 가능 상태는 Service에서 계산한다.

---

## 2. Naming Convention

DB column과 table 이름은 snake_case를 사용한다.

예:

```text
free_swimming_status
pool_operating_hours
info_verified_at
```

TypeScript와 API에서는 camelCase를 사용한다.

예:

```text
freeSwimmingStatus
poolOperatingHours
infoVerifiedAt
```

---

## 3. Identifier Policy

식별자 타입은 각 테이블의 실제 Drizzle schema를 기준으로 한다.

현재 구현된 `pools.id`는 `serial`을 사용한다.

예:

```ts
id: serial("id").primaryKey();
```

과거 설계 문서에 UUID 기준이 남아 있을 수 있으므로
새 테이블을 만들 때 문서만 보고 UUID를 자동 적용하지 않는다.

새 테이블의 PK/FK 타입은
현재 코드와 관계 구조를 확인한 뒤 결정한다.

---

## 4. Core Entity Relationships

기본 관계는 다음과 같다.

```text
Pool
├─ 1:N PoolOperatingHour
├─ 1:N FreeSwimmingSchedule
│      └─ 1:N FreeSwimmingSession
├─ 1:N FreeSwimmingPrice
├─ 1:N PoolClosure
├─ 1:N Facility
├─ 1:N PoolImage
├─ 1:N Review
└─ 1:N PoolReport

User
├─ 1:N Favorite
├─ 1:N Review
└─ 1:N PoolReport

Review
└─ 1:N ReviewImage
```

---

## 5. `pools`

수영장의 기본 정보와
자유수영 운영 여부를 저장한다.

현재 주요 필드:

```text
id
name
address
latitude
longitude
phone
homepage_url
status
free_swimming_status
free_swimming_verified_at
free_swimming_note
info_verified_at
```

### `status`

수영장 자체의 서비스 상태다.

현재 값:

```text
ACTIVE
INACTIVE
```

의미:

```text
ACTIVE
→ SwimFind에서 정상적으로 제공하는 수영장

INACTIVE
→ 폐업, 장기 운영 중단, 데이터 비활성화 등
```

자유수영 가능 여부를 나타내는 값이 아니다.

---

### `free_swimming_status`

자유수영 운영 여부를 나타낸다.

현재 값:

```text
OPERATED
NOT_OPERATED
UNKNOWN
```

의미:

```text
OPERATED
→ 자유수영 운영이 확인됨

NOT_OPERATED
→ 자유수영을 운영하지 않는 것이 확인됨

UNKNOWN
→ 자유수영 운영 여부를 아직 확인하지 못함
```

기본값은:

```text
UNKNOWN
```

으로 둔다.

`NOT_OPERATED`와 `UNKNOWN`은 절대 같은 의미로 처리하지 않는다.

---

### `free_swimming_verified_at`

자유수영 운영 여부를 마지막으로 확인한 시각이다.

`info_verified_at`과 분리한다.

예:

```text
info_verified_at
→ 수영장 기본 정보 확인 시점

free_swimming_verified_at
→ 자유수영 운영 여부 확인 시점
```

---

### `free_swimming_note`

수영장 전체 자유수영에 공통으로 적용되는 안내를 저장한다.

예:

```text
수영복, 수경, 수모 필수
오리발 사용 금지
개인 훈련용품 사용 제한
```

회차마다 같은 문구를 반복 저장하지 않는다.

---

## 6. `pool_operating_hours`

수영장 시설 자체의 일반 운영시간을 저장한다.

주요 필드:

```text
id
pool_id
day_of_week
open_time
close_time
is_closed
verified_at
```

일반 운영시간은 자유수영 시간과 별개다.

예:

```text
수영장 운영시간
06:00 ~ 21:00

자유수영
14:00 ~ 14:50
```

두 정보를 하나의 테이블에 섞지 않는다.

---

### Regular Closure

매주 일요일처럼 반복되는 정기 휴관은:

```text
pool_operating_hours.is_closed = true
```

로 관리한다.

예:

```text
SUN
open_time = NULL
close_time = NULL
is_closed = true
```

정기 휴관을 `pool_closures`에 매주 날짜별로 생성하지 않는다.

### Data Integrity Rules

운영시간 데이터의 실수를 DB에서 막기 위해 다음 규칙을 적용한다.

- 요일은 `MON`부터 `SUN`까지의 enum 값만 사용한다.
- 한 수영장에는 같은 요일의 운영시간을 하나만 저장한다.
- 휴관이면 `is_closed = true`이고 `open_time`, `close_time`은 모두 `NULL`이다.
- 운영일이면 `is_closed = false`이고 두 시간은 모두 존재하며 `open_time < close_time`이다.
- MVP에서는 자정을 넘는 일반 운영시간을 한 행에 저장하지 않는다.

---

## 7. `free_swimming_schedules`

요일별 정기 자유수영 일정의 적용 범위를 저장한다.

주요 필드:

```text
id
pool_id
day_of_week
start_date
end_date
status
verified_at
source_url
```

요일 값:

```text
MON
TUE
WED
THU
FRI
SAT
SUN
```

---

### Date Range

`start_date`, `end_date`는
공식적으로 확인된 경우에만 저장한다.

확인되지 않은 경우:

```text
NULL
```

로 둔다.

두 날짜가 모두 존재하면:

```text
start_date <= end_date
```

를 만족해야 한다.

NULL은 단순히 적용 기간이 명시되지 않았다는 의미이며,
과거 또는 미래 운영을 보장한다는 의미가 아니다.

---

### Schedule Overlap

MVP에서는 같은 수영장, 같은 요일, 같은 적용 기간의
`ACTIVE` 일정이 중복되지 않도록 검증한다.

`start_date`, `end_date`가 모두 동일한 일정만 중복으로 본다.
`NULL`은 각각 무한 과거와 무한 미래로 정규화해 비교한다.

기간이 일부 겹치지만 시작일 또는 종료일이 다른 일정은 MVP에서 허용한다.
실제 운영 데이터에서 기간 겹침 문제가 확인되면 exclusion constraint 도입을 검토한다.

---

## 8. `free_swimming_sessions`

실제 자유수영 회차 시간을 저장한다.

주요 필드:

```text
id
schedule_id
start_time
end_time
entry_close_time
eligibility_note
```

---

### Time Rules

기본 조건:

```text
start_time < end_time
```

하루를 넘기는 회차는 MVP에서는 한 회차로 저장하지 않고
필요하면 날짜 기준으로 분리한다.

---

### `entry_close_time`

공식 입장 마감 시간이 확인된 경우에만 저장한다.

확인되지 않은 경우:

```text
NULL
```

로 둔다.

NULL을 다음 의미로 해석하지 않는다.

```text
입장 제한 없음
종료 전에는 언제든 입장 가능
```

입장 마감 시간이 존재하면:

```text
entry_close_time <= end_time
```

이어야 한다.

시작 전에 입장 마감되는 규칙도 허용한다.

---

### `eligibility_note`

해당 회차에만 적용되는 특이사항을 저장한다.

예:

```text
선착순 70명
해당 강습반 등록자만 이용 가능
현장 발권만 가능
```

수영장 전체에 공통인 안내는
`pools.free_swimming_note`에 저장한다.

---

### Price Is Not Stored Here

`free_swimming_sessions`에는 가격을 저장하지 않는다.

과거의:

```text
adult_price
```

필드는 사용하지 않는다.

가격은 별도의:

```text
free_swimming_prices
```

에서 관리한다.

---

## 9. `free_swimming_prices`

수영장별 자유수영 요금을 저장한다.

주요 필드:

```text
id
pool_id
price_type
target_type
amount
note
verified_at
source_url
```

### `price_type`

현재 MVP:

```text
DAILY
MONTHLY
```

### `target_type`

현재 MVP:

```text
ADULT
YOUTH
CHILD
```

---

### Amount

금액 단위는 원이다.

```text
amount >= 0
```

가격을 확인하지 못했다고 해서:

```text
0
```

을 저장하지 않는다.

가격 정보 자체가 확인되지 않았다면
해당 row를 만들지 않는다.

---

### Unique Rule

MVP에서는 다음 조합이 중복되지 않도록 한다.

```text
(pool_id, price_type, target_type)
```

예:

```text
ongam + DAILY + ADULT
```

는 한 행만 존재한다.

---

### Price Interpretation

MONTHLY 가격을 DAILY 가격처럼 사용하지 않는다.

가격표가 존재한다는 이유만으로
모든 회차에서 일일입장이 가능하다고 판단하지 않는다.

회차별 차등 요금과 가격 이력은
MVP 이후 확장 범위로 둔다.

---

## 10. `pool_closures`

특정 날짜의 임시 휴관 또는 예외를 저장한다.

주요 필드:

```text
id
pool_id
closure_date
type
description
source_url
verified_at
```

예:

```text
공휴일 휴관
시설 점검
특정 날짜 자유수영 취소
임시 운영 변경
```

---

### Do Not Generate Repeating Closures Automatically

다음과 같은 공지는:

```text
공휴일 휴관
매월 5주차 휴관
```

운영자가 실제 날짜를 확인한 뒤
해당 날짜만 등록한다.

예:

```text
"5주차"라는 문구만 보고
시스템이 날짜를 임의 계산하지 않는다.
```

매주 일요일 같은 고정 휴관은
`pool_operating_hours.is_closed`로 관리한다.

---

### Partial Changes

현재 MVP의 `pool_closures` 구조만으로는
부분 회차 취소나 복잡한 대체 시간표를 완전히 표현하기 어렵다.

따라서:

```text
전일 휴관 확인
→ CLOSED

시간 변경만 확인되었지만
정확한 대체 회차를 계산할 수 없음
→ UNVERIFIED + 안내
```

방향으로 처리한다.

---

## 11. Other Tables

### `pool_images`

수영장 대표 및 추가 이미지를 관리한다.

예상 필드:

```text
id
pool_id
image_key
sort_order
is_primary
```

이미지 저장 정책은 S3 사용 기준에 맞춰
전체 URL보다 object key 저장을 우선한다.

---

### `facilities`

샤워실, 주차 등 시설 정보를 저장한다.

예상 필드:

```text
id
pool_id
type
description
is_available
verified_at
```

---

### `favorites`

사용자의 관심 수영장을 저장한다.

예상 필드:

```text
user_id
pool_id
created_at
```

다음 조합은 unique여야 한다.

```text
(user_id, pool_id)
```

---

### `reviews`

사용자 후기를 저장한다.

예상 필드:

```text
id
user_id
pool_id
content
visited_at
cleanliness_rating
facility_rating
congestion_rating
status
```

---

### `review_images`

후기와 이미지는 1:N 관계다.

예상 필드:

```text
id
review_id
image_key
alt_text
sort_order
created_at
```

후기당 최대 5장까지 허용한다.

최대 이미지 개수는 Service/Zod 검증에서도 확인한다.

---

### `pool_reports`

잘못된 정보 제보와
미등록 수영장 등록 요청을 저장한다.

예상 필드:

```text
id
user_id
pool_id
type
status
suggested_value
source_url
admin_note
```

미등록 수영장 등록 요청에서는
`pool_id`가 NULL일 수 있다.

사용자가 제출한 값은
공식 수영장 데이터에 자동 반영하지 않는다.

---

## 12. Today's Free Swimming Status

오늘 자유수영 상태는
DB column으로 그대로 저장하지 않는다.

`PoolService`에서 다음 데이터를 조합해 계산한다.

```text
Pool status
Free swimming status
Operating hours
Schedule
Session
Closure
Current date/time
Verification status
```

모든 화면에서 같은 Service 결과를 사용한다.

예:

```text
홈
검색 결과
수영장 상세
관심 수영장
```

각 화면에서 상태 계산 로직을 따로 만들지 않는다.

---

## 13. Status Values

현재 계산 상태는 6종이다.

```text
AVAILABLE
ENDED
CLOSED
NO_SCHEDULE
UNVERIFIED
NOT_OPERATED
```

---

### AVAILABLE

현재 또는 이후 일정상
이용 후보 회차가 존재한다.

예:

```text
현재 07:30
다음 회차 08:00 ~ 08:50
```

---

### ENDED

오늘 회차가 모두 종료되었거나
신규 입장 마감이 지났다.

---

### CLOSED

해당 날짜에 시설 휴관 또는
자유수영 전일 취소가 확인되었다.

---

### NO_SCHEDULE

시간표 확인이 완료되었고
오늘 적용되는 자유수영 회차가 없음이 확인되었다.

단순히 schedule row가 없다는 이유만으로
`NO_SCHEDULE`을 반환하지 않는다.

---

### UNVERIFIED

시간표 또는 정보 확인 수준이 부족해
이용 가능 여부를 판단할 수 없다.

`UNVERIFIED`를 이용 불가로 표현하지 않는다.

---

### NOT_OPERATED

해당 수영장이 자유수영을 운영하지 않는 것이
확인된 상태다.

```text
NOT_OPERATED
!=
NO_SCHEDULE
!=
UNVERIFIED
```

---

## 14. Status Calculation Order

날짜와 시간은:

```text
Asia/Seoul
```

기준으로 계산한다.

기본 순서:

```text
1. 수영장 자체 상태 확인
2. 날짜별 휴관 / 예외 확인
3. free_swimming_status 확인
4. 시간표 확인 수준 및 적용 기간 확인
5. 해당 날짜의 회차 확인
6. 현재 시각 및 입장 마감과 비교
```

중요:

```text
날짜별 예외
→ 정기 일정보다 우선
```

---

### Free Swimming Status Handling

휴관이 아니라면:

```text
free_swimming_status = NOT_OPERATED
→ NOT_OPERATED

free_swimming_status = UNKNOWN
→ UNVERIFIED
```

`OPERATED`여도
정확한 시간표나 검증 정보가 부족하면:

```text
UNVERIFIED
```

를 반환할 수 있다.

---

### NO_SCHEDULE Safety Rule

`NO_SCHEDULE`은:

```text
해당 요일에 자유수영 일정이 없다는 사실이
확인된 경우
```

에만 사용한다.

현재 별도의 요일별 조사 완료 column이 없으므로
운영자가 주간 시간표 전체를 확인하여 등록하는 절차가 필요하다.

확인이 보장되지 않으면:

```text
UNVERIFIED
```

를 우선한다.

---

### Time Boundary

회차 시간 구간은:

```text
start inclusive
end exclusive
```

로 본다.

예:

```text
14:00 ~ 14:50

14:00
→ 진행 중

14:49
→ 진행 중

14:50
→ 종료
```

---

## 15. Example Validation

실제 옹암체육센터 데이터를 이용해
모델 구조를 검증했다.

예상 row 구성:

```text
pools
1

pool_operating_hours
7

free_swimming_schedules
6

free_swimming_sessions
22

free_swimming_prices
6

pool_closures
0
```

총:

```text
42 rows
```

일요일은 임시 휴관 row를 생성하지 않고
`pool_operating_hours.is_closed = true`로 처리한다.

실제 데이터 검증 결과
Pool → Schedule → Session 구조를 유지하면서
시간, 요금, 공통 안내, 회차 조건을 분리할 수 있음을 확인했다.

---

## 16. API Data Contract

DB에서는 snake_case를 사용하지만
API에서는 camelCase를 사용한다.

예:

```text
DB
free_swimming_status

API
freeSwimmingStatus
```

자유수영 관련 응답에는 가능한 한
같은 계산 결과를 사용한다.

예:

```text
GET /pools
GET /pools/nearby
GET /pools/{poolId}
GET /pools/{poolId}/free-swimming
```

---

### Free Swimming Response

예상 주요 필드:

```text
status
freeSwimmingStatus
freeSwimmingVerifiedAt
freeSwimmingNote
schedules[]
freeSwimmingPrices[]
closures[]
```

`schedules[]` 내부:

```text
id
dayOfWeek
startDate
endDate
status
verifiedAt
sourceUrl
sessions[]
```

`sessions[]`:

```text
id
startTime
endTime
entryCloseTime
eligibilityNote
```

`freeSwimmingPrices[]`:

```text
id
priceType
targetType
amount
note
verifiedAt
sourceUrl
```

nullable 값은:

```json
null
```

로 반환하고,
목록이 없으면:

```json
[]
```

을 반환한다.

---

## 17. Filtering Rule

예:

```text
availableToday=true
```

는:

```text
AVAILABLE
```

상태만 반환한다.

`UNVERIFIED`를 임의로 이용 불가로 분류하지 않는다.

---

## 18. Verification and Source Data

운영 정보에는 가능한 경우
검증 시각과 출처를 함께 저장한다.

예:

```text
verified_at
source_url
```

다음 정보에 특히 적용한다.

```text
자유수영 일정
가격
휴관
운영 여부
시설 정보
```

출처를 확보하지 못했다면
가짜 URL을 만들지 않고 NULL로 둔다.

---

## 19. User Reports

사용자 제보는 공식 데이터와 분리한다.

기본 흐름:

```text
사용자 제보
→ pool_reports 저장
→ 운영자 검토
→ 공식 출처 확인
→ 승인 또는 반려
→ 필요한 경우 공식 데이터 별도 수정
```

제보 승인 자체가
수영장 데이터를 자동 수정하는 작업이 아니다.

---

### Free Swimming Status Update

운영자가 자유수영 상태를:

```text
NOT_OPERATED
```

로 변경했다면
기존 ACTIVE 자유수영 일정과 충돌하지 않도록
관련 일정 상태를 함께 검토해야 한다.

기존 회차가 없다는 이유만으로
수영장을 자동으로 `NOT_OPERATED`로 변경하지 않는다.

---

## 20. Drizzle Schema Location

Drizzle schema는 다음 위치에서 관리한다.

```text
src/server/db/schema/
```

현재 예:

```text
src/server/db/schema/
├─ index.ts
└─ pools.ts
```

향후 예상:

```text
pool-operating-hours.ts
free-swimming-schedules.ts
free-swimming-sessions.ts
free-swimming-prices.ts
pool-closures.ts
```

실제 파일명은 프로젝트 구조를 확인한 뒤 결정한다.

---

## 21. Migration Rules

DB 변경은 다음 순서를 따른다.

```text
Drizzle schema 수정
→ migration generate
→ SQL 직접 확인
→ dev DB migrate
→ 실제 DB 확인
```

명령 예:

```bash
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit migrate
```

이미 DB에 적용된 migration은
임의로 삭제하거나 수정하지 않는다.

---

### First Migration

현재 첫 migration에는:

```text
free_swimming_status enum
pool_status enum
pools table
```

이 포함되어 있다.

현재 `pools` 테이블의 실제 schema와
migration 파일을 변경 전에 먼저 확인한다.

---

## 22. Seed Rules

개발 DB용 seed는 반복 실행해도
중복 데이터가 생기지 않는 방식으로 작성한다.

즉:

```text
idempotent seed
```

를 지향한다.

개발 seed와 운영 초기 import를 구분한다.

```text
Development Seed
→ 테스트와 개발 반복용

Production Initial Import
→ 검증된 실제 수영장 데이터를 최초 등록
```

사용자 생성 데이터:

```text
favorites
reviews
pool_reports
```

는 운영에서 임의로 seed하거나 초기화하지 않는다.

---

## 23. Data Integrity Rules

가능하면 DB constraint와 Service 검증을 함께 사용한다.

예:

```text
favorites(user_id, pool_id)
→ UNIQUE

free_swimming_prices(
  pool_id,
  price_type,
  target_type
)
→ UNIQUE
```

시간 관련 조건:

```text
start_time < end_time

entry_close_time <= end_time
```

후기 이미지:

```text
최대 5장
```

일부 규칙은 DB constraint보다
Service/Zod 검증이 더 적절할 수 있다.

---

## 24. Unknown Data Rule

SwimFind에서 매우 중요한 원칙이다.

```text
정보가 없음
!=
이용 불가
```

예:

```text
가격 미확인
→ 0원으로 저장하지 않음

입장 마감 미확인
→ NULL

자유수영 여부 미확인
→ UNKNOWN

시간표 불완전
→ UNVERIFIED
```

사용자에게 잘못된 확정 정보를 보여주는 것보다
미확인 상태를 명확하게 표현하는 것을 우선한다.
