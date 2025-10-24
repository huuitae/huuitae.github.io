---
title: Parallel Routes와 Intercepting Routes
date: 2025-10-24T23:18:00+09:00
summary: Next.js의 Parallel Routes와 Intercepting Routes에 대해 알아보자
category: Next.js
tags: [Next.js, App Router, Intercepting Routes, Parallel Routes]
---

## 0️⃣ Next.js Routes

Next.js의 App Router에서는 다양한 라우팅 기능을 제공하고 있습니다.

그 중 `Parallel Routes`와 `Intercepting Routes` 기술을 활용하면
전체 페이지로 나타나는 화면과 모달 형태로 나타나는 UI를 제작할 수 있습니다.

우리가 많이 사용하는 인스타그램의 웹사이트도 해당 방식을 사용하고 있습니다.

인스타그램에서 피드를 확인하기 위해 클릭하면 뒷 배경이 어두워지면서 바로 닫을 수 있는 모달 형태의 화면이 보이게 됩니다.

<img width="744" height="320" alt="next_error" src="/images/apple_instagram_modal.png" />

[Apple instagram](https://www.instagram.com/apple/)

여기서 새로고침을 해보면?

<img width="744" height="320" alt="next_error" src="/images/apple_instagram_page.png" />
<br />

모달에서 보여주었던 내용과 같은 내용을 보여주는 기본 페이지 형태의 UI로 바뀌는 모습을 볼 수 있습니다.

팀 프로젝트를 진행하면서 이것과 같은 기능을 수행하는 페이지를 만들어 보려고합니다.

시작하기에 앞서 이 기술들이 어떤 것인지 간단하게 알아보겠습니다.

## 1️⃣ Parallel Routes

Parallel Routes는 동일한 레이아웃 내에서 한 개 이상의 페이지를 렌더링할 수 있는 기술입니다.  
해당 기술은 SNS의 피드나 대시보드의 UI에서 유용하게 사용할 수 있습니다.

Next.js에서는 기본적으로 라우팅을 설정하기 위해 `app` 디렉토리 하위에 디렉토리를 만들어서 라우팅을 결정합니다.  
Parallel Routes를 사용하기 위해서는 디렉토리의 이름 앞에 `@`를 붙이면 됩니다.

<img width="744" height="320" alt="next_parallel_routes" src="https://h8dxkfmaphn8o0p3.public.blob.vercel-storage.com/docs/light/parallel-routes-file-system.png" />

이렇게 만들어진 Routes는 `Slots`이라는 이름으로 생성됩니다.  
이 `Slot`안에 생성된 `page`파일은 부모 디렉토리의 `Layout` 컴포넌트에게 props로 전달됩니다.

만약 `@test`라는 이름의 디렉토리를 생성했다면 Layout 컴포넌트에서 렌더링 하기위해 `return`문 안에 해당 Slot을 추가해줍니다.

```typescript
export default function Layout({
  children,
  test,
}: {
  children: React.ReactNode
  test: React.ReactNode
}) {
  return (
    <>
      {children}
      {test}
    </>
  )
}
```

Next.js는 직접 경로를 입력하거나 새로고침 할 경우에는 현재 URL과 일치하지 않는 `slots`의 활성 상태를 결정할 수 없습니다.  
이런 일치하지 않는 slot에 대한 대체 렌더링을 위해 `default.tsx`파일을 생성합니다.

만약 해당 파일이 없다면 404를 렌더링하게 됩니다.
<br />

## 2️⃣ Intercepting Routes

`Intercepting routes`는 현재의 레이아웃에서 다른 페이지의 라우트를 로드할 수 있게 해주는 기술입니다.

사용자가 어떠한 컨텐츠를 클릭하려고 할 때 해당 컨텐츠의 라우트를 가로채서 다른 UI로 표출하도록 할 수 있습니다.

<img width="744" height="320" alt="next_parallel_routes" src="https://h8dxkfmaphn8o0p3.public.blob.vercel-storage.com/docs/light/intercepting-routes-soft-navigate.png" />

하지만 URL을 직접 입력하거나 페이지를 새로고침하는 경우에는 `Intercepting routes`가 작동하지 않습니다.

해당 라우팅을 설정하려면 라우트 디렉토리의 맨 앞에 `(.)`를 입력해줍니다.  
만약 `feed`라는 이름을 가진 디렉토리가 있다면 `(.)feed`처럼 작성합니다.

라우트를 가로채기 위해서는 동일한 위치의 세그먼트를 매칭해야 합니다.  
만약 다른 레벨의 세그먼트와 매칭하고 싶다면 우리가 상대 경로를 입력할 때 `../`이나 `../../`을 입력하는 것과 같이
`(.)` 입력 규칙을 사용해주면 됩니다.

- `(.)`: 동일 레벨
- `(..)`: 한 레벨 위
- `(..)(..)`: 두 레벨 위
- `(...)`: app 디렉토리

이렇게 간략하게 두 routes의 특징을 살펴보았습니다.

이제 이 기술들을 활용하여 앞서 설명했던 인스타그램의 피드같은 화면을 다음 포스팅에서 만들어보도록 하겠습니다.

---
