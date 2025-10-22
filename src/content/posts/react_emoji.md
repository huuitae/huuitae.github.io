---
title: Emoji-React-Picker로 이모지 남기기
date: 2025-10-22T13:55:00+09:00
summary: React의 Virtual DOM에 대해 알아보자.
category: React
tags: [React, emoji-react-picker, 코드잇, 팀프로젝트]
---

팀 프로젝트로 진행한 맡은 기능 중 하나인 이모지로 리액션 남기기를 진행해보겠습니다.
<br>

## 0️⃣ 이모지 남기기 기능 소개

상대방의 롤링 페이퍼에 이모지를 남기는 기능 개발을 맡았습니다. 이 기능이 정확히 어떤 기능인지 한 번 알아보겠습니다.
![이모지_표출](https://velog.velcdn.com/images/nudge0613/post/fe4fbc09-eb63-42fd-b906-51fdc58bb7ac/image.png)

**1. 이모지 추가 기능**
<span style='color:var(--prism-code-3)'>`추가`</span> 버튼을 클릭하면 이모지를 표출하고, 이모지를 클릭하면 이모지가 추가됩니다.

**2. 펼치기 기능**
이모지는 최대 3개까지 표출되며 3개가 넘어가면 화살표 모양의 <span style='color:var(--prism-code-3)'>`펼치기`</span> 버튼이 생기고 추가된 다른 모든 이모지들을 보여줍니다.

**3. 이모지 더 불러오기 기능**
펼친 이모지칸에 아래 화살표 모양의 <span style='color:var(--prism-code-3)'>`펼치기`</span> 버튼을 클릭하면 다른 사람이 남긴 이모지를 추가로 더 불러올 수 있습니다.
<span style='color:var(--prism-code-1)'>_해당 기능은 필수 구현 기능은 아니지만 API를 확인해보니 구현 가능할 것 같아 추가로 개발한 기능입니다._</span>

이렇게 크게 3가지의 기능을 지니고 있는데, 여기서 먼저 이모지 추가 기능을 구현해보겠습니다.

<br>

## 1️⃣ 이모지 추가 기능

이 이모지를 남기기 기능 구현을 위해서 라이브러리를 사용하기로 했습니다.
그 중 제가 사용한 라이브러리는  
[emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react) 라이브러리를 사용했습니다.

![emoji-picker-library](https://velog.velcdn.com/images/nudge0613/post/c5dcad31-f6e0-47b3-91b6-a9c5f8996c9c/image.gif)

해당 라이브러리는 다양한 이모지를 추가할 수 있고, 이모지 선택 창의 크기 조절, 다크모드, 이모지 파일 지연 로딩 등의 다양한 옵션을 <span style='color:var(--prism-code-3)'>`props`</span>로 설정할 수 있습니다.

그 중 제일 맘에 들었던 기능은 이모지 간략 표현 UI가 있다는 것이었습니다.
![이모지_간략](https://velog.velcdn.com/images/nudge0613/post/524c76cd-730a-481c-b890-a0ac6c711fe2/image.png)  
수 많은 이모지중에 자주 쓰는 이모지는 얼추 정해져있기 때문에 매번 모든 이모지들을 표출하기 보다는 위의 이미지처럼 간략하게 이모지를 추가할 수 있는 UI가 필요하다고 생각했습니다.

이 emoji-picker-react 라이브러리에서는 <span style='color:var(--prism-code-3)'>`reactionsDefaultOpen={true}`</span> props를 주는 것으로 해당 UI를 구현할 수 있다는 편리함 때문에 해당 라이브러리를 택하게 되었습니다.

라이브러리도 정했으니 이제 본격적으로 기능을 구현해보겠습니다.
추가할 이모지를 표출하는 코드입니다.

```javascript
const { isOpen, onClickToggle, onClickClose } = useToggle();
...

<EmojiPicker
  className="drop-shadow-dropdownBorder z-50"
  open={isOpen}
  width={307}
  height={393}
  onEmojiClick={onClickAddEmoji}
  reactionsDefaultOpen={true}
/>;

...
```

라이브러리 설치 후 <span style='color:var(--prism-code-3)'>`<EmojiPicker />`</span> 컴포넌트를 import해 사용합니다.
선언만 하게 된다면 모든 이모지를 선택할 수 있는 요소가 보이게 됩니다.

이모지를 추가하기 위해 <span style='color:var(--prism-code-3)'>`onEmojiClick`</span> props를 통해 이모지를 클릭했을때 실행할 함수를 전달할 수 있습니다.

```javascript
const onClickAddEmoji = async (emojiData) => {
  if (!emojiData) return

  const reactionData = {
    emoji: emojiData.emoji,
    type: 'increase',
  }

  await postEmoji(postId, reactionData)
  setIsUpdated(true)
}
```

API 요청을 보내면 추가 기능은 끝입니다.

<br>

## 2️⃣ 문제 발생

이모지를 추가한 뒤 추가한 이모지를 바로바로 확인할 수 없는 문제가 있었습니다.

이모지를 다시 표출하기 위해 계속 새로고침을 할 수도 없기에 <span style='color:var(--prism-code-3)'>`state`</span>를 통해 해결하려다 저와 비슷한 문제를 겪고있던 다른 팀원분의 의견과 추후 개발할 기능을 고려하여 <span style='color:var(--prism-code-3)'>`Tanstack-Query`</span> 라이브러리를 도입하자는 결론이 나오게 되었습니다.

해당 라이브러리의 캐싱, 캐싱 초기화 기능을 활용하여 문제를 해결할 수 있었습니다.

<br>

## 3️⃣ Tanstack-Query 도입

기존에는 이모지를 불러오던 로직에 <span style='color:var(--prism-code-3)'>`isUpdated`</span> state를 추가하여 이모지가 업로드 되면 state 값을 변경해 이모지를 다시 불러오는 방식이었습니다.

<span style='color:var(--prism-code-3)'>`Tanstck-Query`</span> 라이브러리를 도입하여 기존 코드를 깔끔하게 개선할 수 있었습니다.

```javascript
export const useGetAllEmojiData = (postId) => {
  return useQuery({
    queryKey: [ALL_EMOJI_DATA_KEY, postId],
    queryFn: () => getAllEmojiData(postId),
    retry: 1,
    enabled: !!postId,
  })
}
```

<span style='color:var(--prism-code-3)'>`useQuery`</span>훅을 통해 이모지들을 불러옵니다. 사용된 옵션들에 대해 알아보자면,

- <span style='color:var(--prism-code-3)'>`queryKey`</span>
  해당 쿼리의 고유한 키를 지정합니다.
- <span style='color:var(--prism-code-3)'>`queryFn`</span>
  fetch할 함수를 선언합니다.
- <span style='color:var(--prism-code-3)'>`retry`</span>
  queryFn 실행에 실패했을 때 자동으로 재시도 할 횟수를 지정합니다.
- <span style='color:var(--prism-code-3)'>`enabled`</span>
  해당 쿼리를 자동으로 실행할 조건을 정합니다. 여기서는 postId가 있을 때만 자동 실행

여기서 이 라이브러리의 핵심인 <span style='color:var(--prism-code-3)'>`staleTime`</span>, <span style='color:var(--prism-code-3)'>`gcTime`</span>을 설정하지 않았는데, 이모지 리액션 같이 자주 반응되는 요소의 경우에는 fetching도 자주 해주어야겠다고 생각하여 따로 설정해두지 않았습니다.

이모지를 추가하는 부분도 커스텀 훅을 제작하여 수정했습니다.

```javascript
export const usePostEmoji = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (reactionData) => postEmoji(reactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_EMOJI_DATA_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [HEADER_SERVICE_KEY],
      })
    },
    onError: (error) => console.error(error),
    retry: 1,
    retryDelay: 500,
  })

  return { mutate, isPending, isSuccess }
}
```

추가 기능은 <span style='color:var(--prism-code-3)'>`useMutation`</span>훅을 사용했습니다. 사용한 옵션들은 다음과 같습니다.

- <span style='color:var(--prism-code-3)'>`mutationFn`</span>
  useQuery의 queryFn과 같은 역할을 수행합니다.
- <span style='color:var(--prism-code-3)'>`onSuccess`</span>
  mutationFn이 성공적으로 수행된 이후 호출할 함수입니다.
- <span style='color:var(--prism-code-3)'>`onError`</span>
  mutationFn이 실패했을 경우 호출할 함수입니다.
- <span style='color:var(--prism-code-3)'>`retry`</span>
  mutationFn 실행에 실패했을 때 자동으로 재시도 할 횟수를 지정합니다.
  <span style='color:var(--prism-code-1)'>_찾아보니 데이터 생성, 수정, 삭제 요청에서 재시도를 하는 것은 위험할 수 있다고 합니다.._</span>
- <span style='color:var(--prism-code-3)'>`retryDelay`</span>
  재시도 간격을 지정합니다.

해당 훅에서 반환한 <span style='color:var(--prism-code-3)'>`mutate()`</span>로 매개변수를 넘겨 받아 useMutation의 mutationFn을 실행할 수 있습니다.

<br>

## 4️⃣ 이모지 더 불러오기 기능

<span style='color:var(--prism-code-3)'>`Tanstack-Query`</span> 라이브러리의 <span style='color:var(--prism-code-3)'>`useInfiniteQuery`</span> 훅을 통해 수월하게 개발할 수 있던 기능이었습니다.

<span style='color:var(--prism-code-3)'>`useInfiniteQuery`</span> 훅은 데이터를 받아와서 <span style='color:var(--prism-code-3)'>`pages`</span>라는 하나의 배열에 계속해서 담는 방식으로, 무한 스크롤이나 더보기 로직에 주로 사용되는 훅 입니다. tanstack query의 dev툴을 통해 확인해보겠습니다.
![dev_tool1](https://velog.velcdn.com/images/nudge0613/post/8820f328-6eb9-4e3a-ba9a-6f8ac4289314/image.png)  
받아온 이모지 데이터가 <span style='color:var(--prism-code-3)'>`pages`</span>의 0번 인덱스에 위치하고, 그 인덱스 안에는 실제 데이터인 <span style='color:var(--prism-code-3)'>`results`</span>가 있습니다. 여기서 이모지를 더 불러오게 되면,

![dev_tool2](https://velog.velcdn.com/images/nudge0613/post/2f762b4d-b9d5-4de2-afa3-f08e2f0766a6/image.png)  
<span style='color:var(--prism-code-3)'>`pages`</span> 배열 안의 요소가 하나 더 늘어난 모습을 확인할 수 있습니다. 이어서 코드를 살펴보겠습니다.

```javascript
export const useGetAllEmojiData = (emojiParams) => {
  return useInfiniteQuery({
    queryKey: [ALL_EMOJI_DATA_KEY, emojiParams],
    queryFn: ({ pageParam }) => getAllEmojiData(emojiParams, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return new URL(lastPage.next).searchParams.get("offset");
      }

      return undefined;
    },
    gcTime: 0,
  });
```

아까 위에서 사용했던 <span style='color:var(--prism-code-3)'>`useGetAllEmojiData`</span>를 <span style='color:var(--prism-code-3)'>`useInfiniteQuery`</span>훅으로 수정하였습니다.

<span style='color:var(--prism-code-3)'>`queryFn`</span> 부분을 보면 구조 분해 할당으로 <span style='color:var(--prism-code-3)'>`pageParam`</span>을 가져와 사용합니다.
이는 밑 부분의 <span style='color:var(--prism-code-3)'>`initialPageParam`</span>을 통해 초깃값을 설정해주거나 그 밑 부분의 <span style='color:var(--prism-code-3)'>`getNextPageParam`</span>의 콜백 함수를 통해 설정할 수 있습니다.

<span style='color:var(--prism-code-3)'>`initialPageParam`</span>의 값을 0으로 해놓았으니 맨 처음 실행될 땐 값이 0으로 설정됩니다.
<span style='color:var(--prism-code-3)'>`getNextPageParam`</span>의 콜백함수는 <span style='color:var(--prism-code-3)'>`lastPage`</span>를 매개변수로 받는데, 이는 가장 최근에 불러온 데이터를 의미합니다.

이모지의 리스트를 요청하는 API의 응답으로 <span style='color:var(--prism-code-3)'>`next`</span> 라는 값이 주어지는데, 이 값에는 다음 이모지를 요청할 URL을 담고있습니다.

여기에 <span style='color:var(--prism-code-3)'>`offset`</span> 이라는 이름을 가진 쿼리스트링의 값을 가져와서 리턴합니다. 이 값이 8이라고 한다면 queryFn의 <span style='color:var(--prism-code-3)'>`pageParam`</span>의 값이 이 쿼리스트링의 값을 사용하기 때문에 맨 처음 0이었던 파라미터의 값이 8로 결정됩니다.

따라서 다음 요청시에는 이 변환된 파라미터를 사용하여 새로운 데이터인 <span style='color:var(--prism-code-3)'>`더 보여줄 이모지`</span>들을 불러올 것입니다.

하지만 더 불러올 이모지가 없어 next의 값이 null이라면 undefined를 리턴합니다.

이제 이 커스텀 훅의 리턴 값을 구조 분해 할당을 통해 사용합니다.

```javascript
const {
    data: allEmojiData,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetAllEmojiData(emojiParams);

...

<DropdownExpandEmoji
  allEmojiData={allEmojiData}
  fetchNextPage={fetchNextPage}
  hasNextPage={hasNextPage}
/>;
```

<span style='color:var(--prism-code-3)'>`data`</span>로 실제 데이터에 접근합니다.
<span style='color:var(--prism-code-3)'>`fetchNextPage`</span> 함수를 통해 더 보여줄 데이터를 불러옵니다.
<span style='color:var(--prism-code-3)'>`hasNextPage`</span> 값을 통해 더 불러올 데이터가 있는지 확인합니다.

이렇게 더 불러오기 기능까지 구현하였습니다.

---

구현했던 기능 중에 가장 까다로웠던 기능이라고 생각합니다.  
 이번 일을 계기로 tanstack-query 라이브러리도 공부해보는 경험이 되었습니다.

> 참고
> [useInfiniteQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery)
