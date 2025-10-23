---
title: React 에러 바운더리로 오류 처리하기
date: 2025-10-23T17:35:00+09:00
summary: 에러 바운더리로 오류 처리하기
category: React
tags: [React, Error boundary, TypeScript, 에러 처리, 토스트]
---

## 0️⃣ Error

React를 사용해서 개발할 때 에러를 마주하게 되면 기존에 렌더링된 화면이 사라지고 에러가 표출되는 흰색화면이 보이게 됩니다.

<img width="744" height="320" alt="next_error" src="/images/next_error.png" />

_Next.js의 에러 화면_

이렇게 오류를 화면 전체로 띄우지 않고 내가 개발 중인 페이지를 보면서 에러를 표출하기 위해
React의 `error boundary`를 사용해서 에러를 확인할 수 있도록 하겠습니다.

<br />

## 1️⃣ Error boundary

`Error boundary`는 렌더링 도중 발생하는 에러에 대해 특정 `fallback UI`를 표시할 수 있는 특수한 컴포넌트 입니다.

```typescript
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // state를 업데이트하여 다음 렌더링에 fallback UI가 표시되도록 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // 사용자 지정 fallback UI를 렌더링할 수 있습니다.
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

리액트 공식 문서에 있는 error boundary의 예제 코드 입니다.

- `static getDerivedStateFromError()`: 오류 메시지를 표시하도록 지시하는 state를 반환합니다.
- `componentDidCatch()`: side effect를 다루기 위해 사용합니다.
- `render()`: 화면에 표시할 react node를 반환합니다.

해당 컴포넌트는 **클래스 컴포넌트**로 되어있기 때문에 함수형 컴포넌트로 리액트를 처음 사용해본 저의 입장에서는
다소 어색한 느낌이었습니다.

그렇다면 에러 바운더리가 클래스 컴포넌트로 되어있는 이유가 무엇일까요?

그 이유는 에러 처리에 필요한 `static getDerivedStateFromError()` 메서드와 `componentDidCatch()` 메서드를 클래스 컴포넌트에서만 사용할 수 있기 때문입니다.

그렇다고 오류처리를 위해 매번 `ErrorBoundary`클래스를 작성해줄 필요는 없습니다.  
[`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 라이브러리를 설치해 사용하면 클래스 파일을 작성하지 않고 에러를 다룰 수 있습니다.

<br />

## 3️⃣ 토스트 메시지로 에러 표출하기

이번엔 직접 `ErrorBoundary` 클래스를 제작해서 발생한 에러 내용을 토스트 메시지로 표출해보도록 하겠습니다.

토스트 UI는 [`react-toastify`](https://www.npmjs.com/package/react-toastify) 라이브러리를 사용했습니다.

일단 `ErrorBoundary` 클래스를 작성합니다.

```typescript
"use client";

import { Icon } from "@/components";
import { Component } from "react";
import { toast } from "react-toastify";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const ALERT_ERROR_ICON = <Icon icon="AlertIcon" color="red300" size="md" />;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 오류가 발생한 후 대체 UI를 렌더링하기 위해 state를 업데이트 합니다.
   */
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  /**
   * 오류 정보를 기록하는 데 사용합니다. side effect를 수행할 수 있습니다.
   * @param error
   * @param errorInfo
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    toast.error(error.message, { icon: ALERT_ERROR_ICON });
  }

  /**
   * @returns props로 받은 대체 UI 또는 자식 컴포넌트를 렌더링합니다.
   */
  render(): React.ReactNode {
    return this.props.children;
  }
}

export default ErrorBoundary;
```

토스트 메시지에 아이콘도 같이 표출하기 위해서 `<Icon />` 컴포넌트도 만들어주었습니다.

`componentDidCatch()` 메서드에서 `react-toastify` 라이브러리의 `toast.error()` 함수에 전달된 error 객체의 메시지와
같이 표출할 아이콘 컴포넌트를 넣어줍니다.

보이는 화면은 그대로 유지할 것이기 때문에 `render()`함수에서는 `children`을 그대로 반환해줍니다.

이제 `ErrorBoundary`를 사용해보겠습니다.

에러가 발생할 가능성이 있는 컴포넌트 `<ErrorBoundary>` 컴포넌트를 씌워줍니다.  
전 Next.js를 사용했기 때문에 `Layout` 컴포넌트에 자식 요소를 씌워주겠습니다.

```typescript
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
```

에러 처리가 잘 되는지 테스트 하기 위한 코드를 작성하겠습니다.

```typescript
const [hasErr, setHasErr] = useState(false);
if (hasErr) throw new Error('에러가 발생했습니다!');

return (
  <Button label="오류를 표출합니다" onClick={() => setHasErr(true)} />
)
```

버튼을 클릭했을 때 `hasErr` state의 값을 `true`로 변경해서 에러를 표출하는 코드입니다.

에러 바운더리는 렌더링 과정에서 발생하는 에러를 감지하기 때문에 이벤트 핸들러나 `setTimeout`, `setInterval`,
`async/await`에서는 에러를 감지하지 못합니다.

따라서 `state`를 변경하거나 `useEffect`훅을 사용해 재렌더링이 발생하도록 하면 에러 바운더리가 감지할 수 있습니다.

<img width="744" height="320" alt="error_boundary" src="/images/error_boundary_test2.gif" />
<br />

오른쪽 상단에 발생시킨 에러 메시지의 내용이 담긴 토스트 메시지가 잘 표출되는 모습을 확인할 수 있습니다.

> 참조  
> [error boundary로 렌더링 오류 포착하기](https://ko.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---
