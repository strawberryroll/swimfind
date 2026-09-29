# SwimFind Styling Guide

SwimFind의 스타일링 구조와 CSS 작성 원칙을 정의한다.

UI 컴포넌트나 페이지 스타일을 구현하거나
새로운 스타일링 패턴을 도입할 때 이 문서를 참고한다.

현재 스타일링 기준은 다음과 같다.

```text
CSS Modules
CSS Variables
CVA
clsx
```

Tailwind CSS와 vanilla-extract는 사용하지 않는다.

---

## 1. Styling Principles

SwimFind는 다음 원칙을 따른다.

- JSX에는 화면 구조와 의미를 둔다.
- 실제 시각 스타일은 CSS 파일에 둔다.
- 컴포넌트 전용 스타일은 CSS Modules로 관리한다.
- 공통 디자인 값은 CSS Variables로 관리한다.
- 반복되는 variant 조합은 CVA로 관리한다.
- 단순한 조건부 className은 clsx를 사용한다.
- 모든 컴포넌트에 CVA를 강제로 적용하지 않는다.
- 화면마다 임의의 색상, 간격, radius 값을 반복해서 만들지 않는다.
- 공용 UI와 도메인 UI의 역할을 구분한다.
- MVP 단계에서 과도한 디자인 시스템을 먼저 만들지 않는다.

---

## 2. Why CSS Modules

Next.js가 기본 지원하는 CSS Modules를 사용한다.

별도의 스타일 빌드 플러그인을 추가하지 않고
Next.js의 기본 흐름을 유지한다.

기본 파일 형태:

```text
Component.tsx
Component.module.css
```

예:

```text
Button/
├─ Button.tsx
├─ Button.module.css
└─ Button.variants.ts
```

CSS Modules는 특정 컴포넌트에 속한 스타일을
해당 컴포넌트와 가까운 위치에서 관리하기 위해 사용한다.

---

## 3. Why Not vanilla-extract

초기에는 vanilla-extract를 검토했지만
현재 프로젝트에서는 사용하지 않는다.

이유:

- Next.js + Turbopack 환경에서 추가 통합 설정이 필요함
- Turbopack 관련 통합이 experimental / unstable한 부분이 있음
- 1인 MVP에서 설정 및 업데이트 복잡도를 늘릴 필요가 없음
- 현재 요구사항은 CSS Modules + CSS Variables + CVA로 충분히 처리 가능함

기존 vanilla-extract 관련 설정이나 패키지를 새로 도입하지 않는다.

---

## 4. Why Not Tailwind CSS

Tailwind CSS로도 동일한 UI를 구현할 수 있지만
SwimFind에서는 사용하지 않는다.

이 프로젝트는 다음 방식을 선호한다.

```text
JSX
→ 구조와 의미

CSS Module
→ 실제 모양

CVA
→ variant 조합
```

JSX에 색상, spacing, 크기 등의 utility class를 길게 나열하지 않는다.

스타일을 변경할 때
가능하면 CSS 파일을 확인하면 되도록 유지한다.

---

## 5. Global Style Structure

전역 스타일은 다음처럼 관리한다.

```text
src/
├─ app/
│  └─ globals.css
│
└─ styles/
   └─ tokens.css
```

### `globals.css`

전역적으로 필요한 최소 스타일을 둔다.

예:

```css
@import "../styles/tokens.css";

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--color-background);
  color: var(--color-text);
}
```

모든 컴포넌트 스타일을 `globals.css`에 작성하지 않는다.

---

### `tokens.css`

프로젝트 전체에서 공유하는 디자인 값을 정의한다.

예:

```css
:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --color-background: #ffffff;
  --color-border: #e5e7eb;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

실제 token 값은 디자인이 구체화되면서 조정한다.

초기부터 지나치게 많은 token을 만들지 않는다.

---

## 6. Token Naming

token 이름은 의미 기반으로 작성한다.

좋은 예:

```text
--color-primary
--color-text
--color-background
--color-border

--space-1
--space-2
--space-3

--radius-sm
--radius-md
```

피해야 할 예:

```text
--pool-card-blue
--home-title-margin
--review-button-radius
```

특정 화면이나 컴포넌트 이름에 종속된 값을
전역 token으로 만들지 않는다.

---

## 7. Component Styles

컴포넌트 전용 스타일은
해당 컴포넌트와 가까운 곳에 둔다.

예:

```text
src/components/ui/Button/
├─ Button.tsx
├─ Button.module.css
└─ Button.variants.ts
```

또는 단순한 컴포넌트라면:

```text
Button.tsx
Button.module.css
```

만으로 충분하다.

불필요하게 파일을 세분화하지 않는다.

---

## 8. CSS Modules

예:

```css
/* Button.module.css */

.base {
  border: 0;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.primary {
  background: var(--color-primary);
  color: white;
}

.secondary {
  background: var(--color-background);
  color: var(--color-primary);
}

.sm {
  padding: var(--space-2) var(--space-3);
}

.md {
  padding: var(--space-3) var(--space-4);
}
```

컴포넌트에서는:

```tsx
import styles from "./Button.module.css";
```

형태로 사용한다.

---

## 9. CVA

CVA는 반복되는 variant 조합을 관리할 때 사용한다.

적합한 예:

```text
Button
Badge
Chip
Input
```

예:

```ts
import { cva } from "class-variance-authority";

import styles from "./Button.module.css";

export const buttonVariants = cva(styles.base, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

컴포넌트에서는:

```tsx
<button
  className={buttonVariants({
    variant,
    size,
  })}
>
  {children}
</button>
```

처럼 사용한다.

---

## 10. When to Use CVA

다음처럼 명확한 variant 축이 여러 개 존재하면 CVA를 고려한다.

```text
variant
size
tone
state
```

예:

```text
Button

variant
- primary
- secondary

size
- sm
- md
- lg
```

반대로 스타일 경우의 수가 거의 없다면
CVA를 사용하지 않는다.

예:

```text
Header
Footer
PoolCard
```

단순한 컴포넌트까지 억지로 CVA 구조로 만들지 않는다.

---

## 11. clsx

`clsx`는 단순한 조건부 className을 관리할 때 사용한다.

예:

```tsx
import clsx from "clsx";

import styles from "./PoolCard.module.css";

<div
  className={clsx(
    styles.card,
    isSelected && styles.selected
  )}
>
```

의미:

```text
기본적으로 card 적용
isSelected가 true이면 selected 추가
```

---

## 12. CVA and clsx Together

CVA와 clsx는 서로 대체 관계가 아니다.

예:

```tsx
className={clsx(
  buttonVariants({
    variant,
    size,
  }),
  isLoading && styles.loading,
  className
)}
```

역할:

```text
CVA
→ 기본 variant 조합

clsx
→ 일시적인 조건 또는 추가 className
```

---

## 13. Public UI vs Domain UI

공용 UI와 도메인 UI를 구분한다.

### Public UI

위치:

```text
src/components/ui
```

예:

```text
Button
Input
Modal
Badge
Chip
```

특징:

- SwimFind의 특정 도메인을 모른다.
- 재사용 가능한 스타일 API를 제공한다.
- 필요한 경우 CVA variant를 사용할 수 있다.

---

### Domain UI

위치 예:

```text
src/features/pool
src/features/review
```

예:

```text
PoolCard
PoolStatusBadge
ReviewCard
```

특징:

- SwimFind 도메인 의미를 알고 있다.
- 공용 token과 공용 UI를 재사용한다.
- 도메인 상태에 따른 문구와 표현을 담당할 수 있다.

---

## 14. Domain Status Styling

도메인 상태를 스타일 이름 자체에 과도하게 결합하지 않는다.

예를 들어 `PoolStatusBadge`가 다음 상태를 표현한다고 가정한다.

```text
AVAILABLE
ENDED
CLOSED
UNVERIFIED
```

도메인 컴포넌트에서 상태를
UI tone으로 변환할 수 있다.

예:

```text
AVAILABLE
→ success

ENDED
→ neutral

CLOSED
→ danger

UNVERIFIED
→ warning
```

공용 `Badge`가 `AVAILABLE`이라는 도메인 값을 직접 알 필요는 없다.

---

## 15. Page Styles

페이지 또는 큰 화면 영역에서만 사용하는 스타일은
해당 route 또는 feature와 가까운 위치에 둔다.

예:

```text
src/app/page.module.css
```

또는:

```text
src/features/pool-detail/PoolDetail.module.css
```

모든 페이지 스타일을 `src/styles`에 모으지 않는다.

---

## 16. Responsive Design

반응형 스타일은 CSS `@media`를 사용한다.

예:

```css
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-5);
  }
}
```

화면마다 의미 없이 다른 breakpoint를 만드는 것을 피한다.

프로젝트에서 자주 사용하는 breakpoint 기준이 정해지면
같은 값을 일관되게 사용한다.

주의:

```text
CSS Variables는 media query 조건 자체에 직접 사용할 수 없다.
```

따라서 breakpoint를 CSS Variable처럼 사용하는 구조를
억지로 만들지 않는다.

---

## 17. Avoid Arbitrary Values

가능하면 같은 의미의 값을 반복해서 새로 만들지 않는다.

예:

```css
.card {
  border-radius: 11px;
}

.button {
  border-radius: 10px;
}

.modal {
  border-radius: 12px;
}
```

이런 값들이 같은 디자인 의미라면
공통 token을 검토한다.

예:

```css
border-radius: var(--radius-md);
```

다만 한 번만 사용하는 모든 값을
무조건 token으로 만들 필요는 없다.

---

## 18. Typography

공통 typography가 반복되기 시작하면
CSS Variables 또는 공통 스타일 기준으로 관리한다.

예:

```css
:root {
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

초기부터 모든 font size와 line-height 조합을
디자인 시스템으로 만들지 않는다.

실제 UI에서 반복이 확인된 후 정리한다.

---

## 19. State Styles

hover, focus, disabled, loading 등은
가능하면 해당 컴포넌트 CSS에서 관리한다.

예:

```css
.base:hover {
  opacity: 0.9;
}

.base:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

JS 상태가 꼭 필요한 경우에만
CVA 또는 clsx와 연결한다.

---

## 20. Accessibility

시각적 상태만으로 의미를 전달하지 않는다.

예:

```text
빨간색
→ 오류
```

만 제공하지 않고
텍스트 또는 접근 가능한 label도 함께 제공한다.

focus-visible 스타일을 임의로 제거하지 않는다.

버튼처럼 동작하는 요소는 가능한 한 실제:

```html
<button></button>
```

을 사용한다.

CSS 편의를 위해 잘못된 HTML 요소를 선택하지 않는다.

---

## 21. className Extension

공용 UI는 필요하면 외부 `className`을 받을 수 있다.

예:

```tsx
type ButtonProps = {
  className?: string;
};
```

그리고:

```tsx
className={clsx(
  buttonVariants({ variant, size }),
  className
)}
```

처럼 합친다.

단, 외부 className으로 내부 구조를 과도하게 덮어쓰는 방식에
의존하지 않는다.

---

## 22. File Naming

CSS Module은 다음 형식을 사용한다.

```text
Component.module.css
page.module.css
```

예:

```text
Button.module.css
PoolCard.module.css
page.module.css
```

vanilla-extract에서 사용하던:

```text
*.css.ts
```

파일은 사용하지 않는다.

---

## 23. Recommended Component Example

예:

```text
src/components/ui/Button/
├─ Button.tsx
├─ Button.module.css
└─ Button.variants.ts
```

`Button.module.css`:

```css
.base {
  border: 0;
  border-radius: var(--radius-md);
}

.primary {
  background: var(--color-primary);
  color: white;
}

.secondary {
  background: var(--color-background);
  color: var(--color-text);
}

.sm {
  padding: var(--space-2) var(--space-3);
}

.md {
  padding: var(--space-3) var(--space-4);
}
```

`Button.variants.ts`:

```ts
import { cva } from "class-variance-authority";

import styles from "./Button.module.css";

export const buttonVariants = cva(styles.base, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

---

## 24. Do Not Overbuild the Design System

초기 MVP에서 다음을 미리 모두 만들지 않는다.

```text
수십 개의 color token
모든 typography 조합
모든 spacing 단계
사용하지 않는 UI 컴포넌트
과도한 variant 시스템
```

실제 화면 구현에서 반복되는 규칙이 나타날 때
필요한 만큼 확장한다.

---

## 25. Decision Guide

스타일을 작성할 때 다음 순서로 판단한다.

```text
프로젝트 전체에서 공유되는 값인가?
→ CSS Variable

특정 컴포넌트의 모양인가?
→ CSS Module

여러 variant 조합을 반복해서 선택하는가?
→ CVA

단순한 true / false 조건인가?
→ clsx
```

예:

```text
primary color
→ CSS Variable

PoolCard layout
→ CSS Module

Button size + variant
→ CVA

isSelected
→ clsx
```

---

## 26. General Principle

SwimFind 스타일링의 목표는
도구를 많이 사용하는 것이 아니다.

다음 구조를 유지하는 것이 핵심이다.

```text
디자인 공통값
→ CSS Variables

컴포넌트 모양
→ CSS Modules

반복 variant
→ CVA

간단한 조건부 class
→ clsx
```

JSX는 구조와 의미를 읽기 쉽게 유지하고,
시각적인 규칙은 가능한 한 CSS에서 확인할 수 있게 한다.
