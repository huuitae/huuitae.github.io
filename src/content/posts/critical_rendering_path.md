---
title: Critical Rendering Path(CRP)
date: 2025-10-21T23:20:16+09:00
summary: Critical Rendering Path에 대해 알아보자.
category: Web
tags: [브라우저 렌더링]
---

### 크리티컬 렌더링 패스(Critical Rendering Path)?

브라우저가 화면을 그리기 위해 거치는 주요 단계를 의미합니다.
주요 단계로는 `HTML`과 `css`를 파싱하여 `DOM` 트리와 `CSSOM` 트리를 생성하여 결합해 렌더 트리를 만들고, 이를 기반으로 레이아웃과 페인트 작업이 이루어집니다.

![html_parser_work](https://velog.velcdn.com/images/nudge0613/post/5b956251-2fcc-43a2-8451-fbf2fe603160/image.png)

서버에 요청한 HTML 파일을 전달 받으면 브라우저는 HTML 파싱을 시작하고 DOM 트리로 변환합니다. 여기서 `CSS`, `JS` 파일의 링크를 찾을 때마다 관련 파일을 받기 위해 요청을 보냅니다. 이 때 html 파싱은 잠깐 멈추게 됩니다.

브라우저는 CSS 객체 모델을 구축하는 작업이 완료되면 렌더 트리를 생성하고 보여지는 모든 콘텐츠의 스타일을 계산합니다. 레이아웃이 시작되면 모든 렌더 트리의 요소에 대한 위치와 크기가 정의되고, 레이아웃이 완료됐을 때 페이지는 화면에 '페인트' 됩니다.

그렇다면 `DOM`과 `CSSOM`은 무엇일까요?🤔

<br />

### DOM(Document Object Model)과 DOM 트리

문서 객체 모델(**DOM**)은 `HTML`, `XML` 문서의 프로그래밍 인터페이스로, 프로그래밍 언어들이 사용할 수 있게 `nodes`와 `objects`로 문서를 표현합니다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>빌려온고양이</title>
  </head>
  <body>
    고양이의 종류...
  </body>
</html>
```

위와 같이 작성된 `html` 파일을 `DOM`이 태그 트리 구조로 변경합니다.

트리에 있는 요소는 모두 객체로 태그는 요소 노드(Element node), `<title>` 태그나 `<body>` 태그 안에 있는 문자는 텍스트 노드 (Text node)가 됩니다.
이 텍스트 노드는 문자열만 담고 자식 노드를 가질 수 없어 나무에 끝에 매달린 이파리라는 의미인 잎 노드(leaf node)🍃가 됩니다.

또한 공백(` `)과 줄넘김(`'\n'`)도 텍스트 노드가 됩니다.

이렇게 만들어진 DOM은 자바스크립트로 `document` 객체에 접근하여 스타일을 변경하거나 해당하는 요소를 가져와 입맛에 맞게 다룰 수 있습니다.😊

<br />

### CSSOM(CSS Object Model)

CSS 객체 모델(**CSSOM**)도 브라우저가 DOM을 생성하는 것과 같은 프로세스를 진행하여 트리 구조를 갖게 됩니다.

```css
body {
	margin 0 auto;
}

p {
	font-size: 14px;
}

p span {
	color: red;
}
```

위의 CSS를 파싱하게 된다면 CSSOM은 트리 구조를 가지게 되면서 `cascading` 룰을 통해 세분화 됩니다. _`<p>`안의 `<span>`의 색상은 빨간색이 된다._

<br />

### Render Tree

`DOM`과 `CSSOM`은 독립적인 개체로 이 두 개체를 하나로 합쳐 하나의 콘텐츠로 표현하기 위해 렌더 트리를 생성하게 됩니다.
![render_tree](https://velog.velcdn.com/images/nudge0613/post/37023d64-3484-4f04-a9da-dafe8894bf8c/image.png)
브라우저가 `DOM`과 `CSSOM`을 렌더 트리에 결합합니다. 렌더 트리는 페이지에 표시되는 모든 `DOM` 콘텐츠와 각 노드의 `CSSOM` 스타일 정보를 캡쳐합니다.

브라우저가 렌더 트리를 생성하면서 `display: none` 속성을 가지고 있는 노드는 렌더 트리에서 누락되게 됩니다. 그 후 각 노드에 일치하는 `CSSOM`을 적용하고 각 노드를 계산된 스타일과 함께 내보내게 됩니다.

이렇게 렌더 트리가 생성되었으면 레이아웃 단계로 넘어가게 됩니다.

레이아웃은 기기의 뷰포트 내에서 노드의 정확한 위치와 크기를 계산하는 과정입니다. 브라우저가 각 객체의 정확한 크기와 위치를 알아내기 위해 렌더 트리의 루트에서부터 쭉 훑어봅니다.

레이아웃까지 완료되면 브라우저는 `Paint Setup`과 `Paint` 이벤트를 발생시켜 렌더 트리를 화면의 픽셀로 변환하게 되면 페이지가 표시됩니다.

<br />

이렇게 크리티컬 렌더링 패스(CRP)에 대해 살펴보았습니다.
브라우저 렌더링에 대해 좀 더 자세히 알 필요가 있을 것 같습니다.
감사합니다.☺️

> 참조
> [CSSOM(CSS Object Model)- 빈츠 블로그](https://onlydev.tistory.com/8)  
> [렌더링 트리 생성, 레이아웃 페인트 - 구글 개발자 블로그](https://web.dev/articles/critical-rendering-path/render-tree-construction?hl=ko)  
> [DOM 트리 - javascript.info](https://ko.javascript.info/dom-nodes)
