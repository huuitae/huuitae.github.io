---
title: 카카오톡 공유 기능 넣기
date: 2025-10-22T14:20:00+09:00
summary: 카카오톡 공유기능을 넣어보자
category: React
tags: [React, emoji-react-picker, 코드잇, 팀프로젝트]
---

기초 프로젝트에서 구현한 마지막 기능인 카카오톡 공유와 URL 복사 기능입니다.

## 0️⃣ 공유 기능 소개

![공유_버튼](https://velog.velcdn.com/images/nudge0613/post/41071e51-e8b5-4475-8f6d-dde7055af53b/image.png)  
공유 기능은 위의 이미지에 보이는 <span style='color:var(--prism-code-3)'>`카카오톡 공유`</span>, <span style='color:var(--prism-code-3)'>`URL 공유`</span> 버튼을 통해 사용할 수 있습니다.
이 기능을 사용하면 현재 롤링 페이퍼 페이지의 내용을 공유합니다.

카카오톡 공유는 말 그대로 카카오톡 어플리케이션을 통해 공유하는 기능이고, URL 공유 같은 경우에는 현재 URL을 클립보드에 복사하는 기능입니다.

비교적 간단했던 URL 공유부터 구현해보겠습니다.

<br>

## 1️⃣ URL 공유 구현하기

해당 기능을 구현하기 위해 JS 내장 객체인 <span style='color:var(--prism-code-3)'>`navigator`</span>의 <span style='color:var(--prism-code-3)'>`clipboard`</span>를 사용하였습니다.
이 clipboard에 현재 페이지의 URL을 등록하여 다른 곳으로 복사가 가능하도록 하겠습니다.

```javascript
const { pathname } = useLocation()

const onClickCopyUrl = async () => {
  try {
    const clipBoardUrl = `${import.meta.env.VITE_BASE_URL}${pathname}`
    await navigator.clipboard.writeText(clipBoardUrl)
    handleClose()
  } catch (error) {
    console.error(error)
  }
}
```

React Router의 <span style='color:var(--prism-code-3)'>`useLocation`</span>훅을 통해 현재 경로를 가져온 후 .env 파일에 등록해놓은 프로젝트 기본 경로와 합쳐줍니다.
<span style='color:var(--prism-code-3)'>`navigator.clipboard.writeText`</span> 메서드를 통해 아까 합친 URL을 클립보드에 넣습니다.

<span style='color:var(--prism-code-3)'>`writeText`</span> 메서드는 Promise를 반환하며, 클립보드에 쓰는 작업이 완료되면 resolve 됩니다.

[클립보드로 복사한 롤링페이퍼](https://rolling-eta.vercel.app/post/13456)

<br>

## 2️⃣ Kakao Developers 등록

카카오톡 공유 기능 구현에 앞서 몇가지 설정을 해주어야 합니다.  
먼저 [Kakao Developers](https://developers.kakao.com/) 홈페이지에 로그인해줍니다. 그 후 상단 네비게이션에서 <span style='color:var(--prism-code-3)'>`앱`</span> 메뉴로 접속합니다.

![앱_화면](https://velog.velcdn.com/images/nudge0613/post/ae64834f-211a-4ae9-94ec-2857a3823f83/image.png) 접속하면 이런 페이지가 나오게 되는데 이전에 등록한 앱이 없다면 아무것도 없을 것 입니다.  
우측 상단의 <span style='color:var(--prism-code-3)'>`앱 생성`</span> 버튼을 클릭하여 등록할 앱을 생성하면 위의 이미지처럼 생성된 앱이 표기되는데 이를 클릭합니다.

![대시보드](https://velog.velcdn.com/images/nudge0613/post/1742b10d-8435-4d05-a89a-ebab281afcce/image.png)그럼 대시보드 페이지로 이동하게되고 이 앱의 통계와 설정 사항을 확인할 수 있습니다.  
왼쪽의 메뉴에서 앱을 클릭하여 <span style='color:var(--prism-code-3)'>`일반`</span> 탭을 클릭합니다.

앱 > 일반 페이지에서는 해당 앱의 API 호출 키와 사이트 도메인을 등록하는 부분이 있습니다.  
앱 키에서는 JavaScript키를 사용할 것이고, Web 항목에서 사이트 도메인을 등록해줍니다.  
여기에 배포할 사이트 링크와 개발에 사용할 로컬호스트 링크를 등록합니다.

![사이트_도메인](https://velog.velcdn.com/images/nudge0613/post/8b3c0cd9-e455-4b23-aa4e-88c540c170e7/image.png)  
추가로 해당 기능은 무료로 사용가능한 기능으로, 해당 앱을 운영하는 멤버로 등록되어있어야 사용이 가능합니다.

멤버를 추가하고 싶다면 왼쪽 메뉴의 멤버 항목을 클릭하여 멤버를 추가할 수 있습니다.

<br>

## 3️⃣ 메시지 템플릿 등록

해당 과정도 Kakao Developers 페이지에서 진행됩니다.
상단 네비게이션에서 <span style='color:var(--prism-code-3)'>`도구`</span> 버튼을 클릭하여 페이지를 이동합니다.
![도구](https://velog.velcdn.com/images/nudge0613/post/99c7d843-66f2-4500-87a3-98135cf2ca14/image.png) 위의 이미지와 같은 페이지로 이동하게 될텐데 여기서 메시지 템플릿으로 이동합니다.
이전에 등록해놓은 앱이 보이면 해당 앱을 클릭합니다.
![템플릿검색](https://velog.velcdn.com/images/nudge0613/post/2299d10e-71bb-4753-af7f-8af30e8ade81/image.png) 이동한 페이지의 왼쪽 <span style='color:var(--prism-code-3)'>`+ 메시지 템플릿 추가`</span> 버튼을 클릭해 기본 메시지 템플릿을 설정합니다. 그럼 위의 이미지처럼 템플릿 정보가 표기되는데 해당 항목을 클릭하여 메시지 템플릿의 세부 정보를 설정해줍니다.

![템플릿상세](https://velog.velcdn.com/images/nudge0613/post/17b85561-1d3d-431a-a457-f220e5a7046c/image.png) 해당 페이지에서는 이미지, 문구, 버튼, 링크 설정등이 가능하며 오른쪽의 미리보기를 통해 어떻게 전송되는지 확인 가능합니다.

추가로 <span style='color:var(--prism-code-3)'>`사용자 인자`</span> 설정이 가능합니다.

![사용자인자](https://velog.velcdn.com/images/nudge0613/post/dc964754-9168-4dac-b043-0ba7f4dbad9b/image.png) <span style='color:var(--prism-code-3)'>  
`${...}`</span> 의 형태로 등록하며 롤링페이퍼 받는 사람의 이름, 댓글의 수, 좋아요 개수, 페이지 경로 등을 사용자 인자로 설정했습니다.

![사용자인자_버튼](https://velog.velcdn.com/images/nudge0613/post/86f02426-4483-4c1e-b4f7-93a15fb0aafb/image.png)  
위의 이미지와 같은 방식으로 사용합니다.
설정 사항을 적용하기 위해 템플릿 미리보기 부분 밑에 있는 <span style='color:var(--prism-code-3)'>`저장`</span> 버튼을 클릭하여 저장합니다.

<br>

## 3️⃣ SDK를 사용하여 기능 구현

이제 기능 구현을 위해 카카오 API 플랫폼에서 제공하는 [JavaScript SDK](https://developers.kakao.com/docs/latest/ko/javascript/getting-started)를 다운받아 사용해야합니다. 링크의 문서 내용을 참고하여 실제 기능을 구현해보겠습니다.

문서의 내용대로 SDK를 사용하기 위한 <span style='color:var(--prism-code-3)'>`<script>`</span>를 index.html 파일에 넣고 SDK를 초기화합니다.

카카오톡에서 제공하는 기본적인 템플릿을 사용하지 않고 따로 커스텀한 템플릿을 사용했기 때문에 SDK의 <span style='color:var(--prism-code-3)'>`sendCustom`</span> 메서드를 사용합니다.

```js
const TEMPLATE_ID = 123485
const { pathname } = useLocation()

const onClickShareKakao = () => {
  Kakao.Share.sendCustom({
    templateId: TEMPLATE_ID,
    templateArgs: {
      path: pathname,
      name: recipient.name,
      messageCount: recipient.messageCount,
      reactionCount: recipient.reactionCount,
    },
  })
}
```

아까 만들어둔 템플릿 아이디와 사용자 인자에 해당하는 값들을 <span style='color:var(--prism-code-3)'>`sendCustom`</span> 메서드에 객체로 전달합니다.

해당 함수를 카카오톡 공유하기 버튼의 <span style='color:var(--prism-code-3)'>`onClick`</span> 이벤트로 등록합니다.

이제 해당 기능을 테스트 해보겠습니다.

![테스트](https://velog.velcdn.com/images/nudge0613/post/39147e5c-3e16-4bff-a23c-f18e6dfef015/image.png)  
버튼을 클릭하면 팝업창이 표출되고 초기 인증을 진행합니다.

![공유선택](https://velog.velcdn.com/images/nudge0613/post/c97ef003-4d26-4b1b-af64-6e1d1d313a1d/image.png)  
인증이 완료되면 위의 이미지처럼 누구에게 공유할건지 표시됩니다.  
공유하고 싶은 사람을 선택하고 공유하기 버튼을 클릭하면 커스텀한 메시지 템플릿에 맞춰 공유 메시지가 전송됩니다. <span style='color:var(--prism-code-1)'>  
_맨 위 이미지 참고_</span>

---

이렇게 팀프로젝트 기능 구현을 전부 구현해보았습니다.  
카카오톡 공유 기능 같은 경우에는 카카오 디벨로퍼스 등록이 더 오래 걸린 것 같습니다.  
그럼 이상으로 글 마치겠습니다.
