---
title: React createPortal로 모달 만들기
date: 2025-10-22T19:20:00+09:00
summary: createPortal() 함수를 활용해서 모달 제작하기
category: React
tags: [React, createPortal, 모달, dialog]
---

React의 `createPortal`을 사용해서 모달을 제작하는 방법에 대해서 알아보려고 합니다.

## 0️⃣ createPortal?

createPortal은 컴포넌트를 DOM의 다른 부분으로 렌더링 할 수 있도록 하는 함수입니다.

```typescript
createPortal(children, domNode, key?)
```

위의 코드처럼 다른 부분으로 이동시킬 `children`, 배치되는 곳을 나타내는 `domNode`, 그리고 선택 옵션으로 portal의 고유한 키를 지정해주는 `key` 옵션이 있습니다.

<br />

## 1️⃣ createPortal 사용하기

실제 사용하는 방법은 다음과 같습니다.

```typescript
return createPortal(
  <p>모달입니다</p>
  document.body
);
```

`<p>`태그로 작성된 요소를 `<body>`태그 안에 넣게됩니다.

`<body>`태그 안에 직접 넣는 것이 싫다면 프로젝트의 루트 부분에 따로 `<div id="id">`로 원하는 id의 요소 안으로 이동시킬 수 있습니다.

```typescript
// RootLayout
return (
  <html>
    <body>
      <div id="modal-root"></div>
    </body>
  </html>
);

// Modal
return createPortal(
  <p>모달입니다</p>
  document.getElementById("modal-root");
);
```

`getElementById()`로 가져온 `<div>`요소를 모달의 요소와 **치환 하는 것이 아니라**
각각의 `child div`로 `createPortal`요소가 생기게 됩니다.

만약 치환하는 방식이었다면 이미 다른 모달이 열려 있을 경우에 문제가 발생할 수도 있기 때문에
`children`이 추가되는 방식으로 더 안전하게 접근할 수 있습니다.

<br />

## 3️⃣ \<dialog>로 모달 쉽게 만들기

HTML 요소 중 `<dialog>`라는 태그가 있습니다.  
해당 태그는 모달을 `open` 속성, `showModal()` 함수 사용 방식 중 어떤 방법을 사용하는지에 따라 동작이 달라집니다.

`<dialog open>`방식으로 표출되면 비모달 방식으로 동작하게 됩니다.  
뒷 배경이 어둡게 표출되는 `backdrop`도 생기지 않습니다.

따라서 모달 요소로 표출하기 위해서는 `showModal()`함수를 사용합니다.

해당 함수를 사용하면 `backdrop`이 표출되고 `ESC`키를 누르는 동작으로 모달창을 닫히게 할 수 있습니다.  
이제 `createPortal`과 `<dialog>`를 사용해서 모달을 쉽고 간편하게 만들어 보겠습니다.

```typescript
const Modal = ({ ref, className, onCancel, children }: ModalProps) => {
  return createPortal(
    <dialog
      className={cn(
        "flex flex-col gap-6 bg-white",
        "rounded-2xl border border-gray-200",
        "shadow-[0_16px_32px_-4px_rgba(12,12,13,0.1)]",
        className
      )}
      ref={ref}
      onCancel={onCancel}
    >
      {children}
    </dialog>,
    document.body
  );
};
```

<img width="473" height="258" alt="dialog_modal" src="/public/images/dialog_modal.png" />
<br />

> 참조  
> [[리액트] createPortal과 createRoot](https://ko.react.dev/reference/react-dom/createPortal#rendering-a-modal-dialog-with-a-portal)  
> [createPortal](https://ko.react.dev/reference/react-dom/createPortal#rendering-a-modal-dialog-with-a-portal)

---
