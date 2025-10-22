---
title: React Virtual DOM
date: 2025-10-22T13:31:00+09:00
summary: React의 Virtual DOM에 대해 알아보자.
category: React
tags: [React, CRP, Virtual DOM, 가상돔, 면접 질문]
---

## 0️⃣ 브라우저의 렌더링 과정

Virtual DOM을 알아보기 전에, 브라우저의 렌더링 과정을 간략하게 알아보겠습니다.

1. HTML Parser가 <span style='color:var(--prism-code-3)'>`DOM Tree`</span>를 만들고 CSS Parser가 <span style='color:var(--prism-code-3)'>`CSSOM Tree`</span>를 만듭니다.
2. 이 두 개의 Tree를 합쳐 <span style='color:var(--prism-code-3)'>`Render Tree`</span>를 만듭니다.
3. 브라우저의 뷰포트를 계산하기 위해 <span style='color:var(--prism-code-3)'>`Layout`</span> 과정을 거칩니다.
4. Layout 과정이 끝나면 Render Tree를 <span style='color:var(--prism-code-3)'>`Paint`</span> 합니다.

<span style='color:var(--prism-code-1)'>_조금 더 알아보려면?_</span>
_[Critial Rendering Path(CRP)](https://velog.io/@nudge0613/critical-rendering-path)_

여기서 어느 요소의 색상을 바꾼다고 한다면 브라우저는 바뀐 요소를 적용하기 위해 해당 요소를 찾은 다음 다시 그려주는 <span style='color:var(--prism-code-3)'>`RePaint`</span> 과정을 수행하고, 구조나 레이아웃이 변경되면 새로 레이아웃을 계산하여 다시 그리는 <span style='color:var(--prism-code-3)'>`ReFlow`</span> 과정을 수행합니다.

이러한 과정은 많은 비용(자원)을 잡아먹기 때문에 자주 발생할 경우 성능이 악화될 수 있습니다.

이 문제를 해결하기 위해 Virtural DOM이 등장하게 됐습니다.

<br>

## 1️⃣ Virtual DOM

<span style='color:var(--prism-code-3)'>`Virtual DOM`</span>은 DOM Tree를 복제하여 메모리에 저장시킨 자바스크립트 객체입니다. DOM에 대한 정보를 가지고 있지만 DOM을 조작하는 메서드는 가지고 있지 않습니다.

이 작업은 메모리상에서 진행하기 때문에 브라우저에서 작업을 수행할 때와 달리 굉장히 효율적으로 작업을 수행할 수 있습니다.

<br>

## 2️⃣ React의 Virtual DOM

React에서는 렌더링 이전의 화면 구조와 렌더링 이후의 화면 구조를 가진 두 개의 Virtal DOM 객체를 보유하고 있습니다.

React에서 <span style='color:var(--prism-code-3)'>`Re-rendering`</span>이 발생되면 새로운 내용이 담긴 Virtual DOM을 생성하고,
렌더링 이전의 화면 구조를 담고있던 Virtual DOM과, 새로 생성된 Virtual DOM의 내용을 비교합니다.

그리고 <span style='color:var(--prism-code-3)'>`Diffing`</span> 알고리즘을을 통해 차이가 있는 부분을 효율적으로 찾아내서 최소한의 변경 사항만 실제 DOM에 적용합니다.

이 Diffing 알고리즘은 두 루트 엘리먼트의 타입이 다르면, React는 이전 트리를 버리고 완전히 새로운 트리를 구축합니다. 만약 타입이 같다면 변경된 속성만 갱신합니다. 이어서 해당 노드의 자식들을 재귀적으로 처리합니다.

이 과정을 React에서는 <span style='color:var(--prism-code-3)'>`Reconciliation(재조정)`</span> 이라고 부릅니다.

![reconciliation](https://velog.velcdn.com/images/nudge0613/post/d01fa638-89ce-4b8b-8ff4-bf9f93c8bf24/image.png)<span style='color:var(--prism-code-1)'>_이미지 출처: momo - Medium_</span>

<br>

## 3️⃣ key 속성을 사용해야 하는 이유

왜 뜬금없이 <span style='color:var(--prism-code-3)'>`key`</span> 얘기를 하는거지? 라고 생각하실 수 있지만, <span style='color:var(--prism-code-3)'>`Reconciliation(재조정)`</span>과 관련된 내용입니다.

React에서 배열을 렌더링할 때 key 속성을 넣지 않고 실행한다면 콘솔창에 key좀 넣으라는 오류가 발생하게 됩니다.

key는 요소의 목록을 만들 때 포함해야하는 특수한 문자열 속성인데요, 이 속성은 어떤 항목을 변경, 추가, 삭제할지 식별하는 것을 돕는 역할을 합니다.

```html
<ul>
  <li>second</li>
  <li>thrid</li>
</ul>
```

원래 있던 요소에서

```html
<ul>
  <li>first</li>
  <!--추가됨-->
  <li>second</li>
  <li>third</li>
</ul>
```

이렇게 맨 위에 새로운 요소를 하나 추가한다고 했을 때, 여기서 리액트는 <span style='color:var(--prism-code-3)'>`<li>second</li>`</span>와 <span style='color:var(--prism-code-3)'>`<li>third</li>`</span>의 트리를 유지하는 것이 아니라, <span style='color:var(--prism-code-3)'>`<ul>`</span>안의 모든 자식들을 변경하게 됩니다.

조금 더 구체적으로 설명하자면, key가 없을 때 React는 **배열의 인덱스(순서)를 key처럼 사용**합니다. 따라서 맨 앞에 새로운 요소가 추가되면, React는 다음과 같이 인식합니다.

- <span style='color:var(--prism-code-3)'>`0번째`</span> 요소가 <span style='color:var(--prism-code-3)'>`<li>second</li>`</span>에서 <span style='color:var(--prism-code-3)'>`<li>first</li>`</span>로 **내용이 변경되었다.**
- <span style='color:var(--prism-code-3)'>`1번째`</span> 요소가 <span style='color:var(--prism-code-3)'>`<li>third</li>`</span>에서 <span style='color:var(--prism-code-3)'>`<li>second</li>`</span>로 **내용이 변경되었다.**
- <span style='color:var(--prism-code-3)'>`2번째`</span> 요소로 <span style='color:var(--prism-code-3)'>`<li>third</li>`</span>가 **새로 추가되었다.**

이런 비효율을 해결하기 위해 key 속성을 사용하여 기존 Virtual DOM 트리와 변경된 Virtual DOM 트리의 자식들이 일치하는 지 확인합니다.

```html
<ul>
  <li key="1">first</li>
  <!--추가됨-->
  <li key="2">second</li>
  <li key="3">third</li>
</ul>
```

이제 이전과는 다르게 새로운 요소가 맨 첫 번째에 추가되어도, 기존에 있던 요소는 유지하고 새로운 요소가 추가됩니다.

---

React를 공부하면서 수 없이 들어본 Virtual DOM에 대해 알아보았습니다.
실시간으로 반응하는 요소가 많은 웹 사이트에서는 효율적이지만, 그렇지 않은 정적인 사이트들은 오히려 직접 DOM을 업데이트 하는 것이 효율적일수도 있다고 합니다.
그럼 글 마치겠습니다 감사합니다.☺️

> 참조
> [Virtual DOM (React) 핵심정리 - momo](https://callmedevmomo.medium.com/virtual-dom-react-%ED%95%B5%EC%8B%AC%EC%A0%95%EB%A6%AC-bfbfcecc4fbb)  
> [[10분 테코톡] 엽토의 Virtual DOM](https://www.youtube.com/watch?v=Bdk7QzbbcEI)  
> [Reconciliation(lagacy.reactjs)](https://ko.legacy.reactjs.org/docs/reconciliation.html)
