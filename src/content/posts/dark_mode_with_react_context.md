---
title: React Context로 다크모드 구현하기
date: 2025-10-22T16:22:00+09:00
summary: 리액트 컨텍스트를 이용해서 테마 관리하기
category: React
tags: [React, React Context, theme, 다크모드, 코드잇, 기초프로젝트]
---

비록 팀프로젝트는 종료됐지만 기존의 다크모드 구현 방식에 대해 아쉬움이 남아있어서 이를 수정해보기로 하였습니다.

## 0️⃣ 문제점 개선

이전에 올렸던 글인 [반응형 헤더 만들기](https://velog.io/@nudge0613/%EB%B0%98%EC%9D%91%ED%98%95-%ED%97%A4%EB%8D%94-%EB%A7%8C%EB%93%A4%EA%B8%B0) 글에서 다크모드 토글 버튼을 만들어 테마를 변경하게끔 구현했습니다.

기존의 구현 방식은 <span style='color:var(--prism-code-3)'>`App`</span> 컴포넌트에서 모든 로직이 동작하는 방식이었기 때문에 테마가 변경된 것을 다른 페이지에서는 로컬스토리지에 접근하여 사용하는 방법밖에 없었습니다.

변경된 테마의 상태를 모든 컴포넌트에게 전달하여 사용할 수 있게 하기 위해서 <span style='color:var(--prism-code-3)'>`React Context`</span> 방식으로 변경하기로 했습니다.

<br>

## 1️⃣ Context 만들기

리액트의 <span style='color:var(--prism-code-3)'>`createContext`</span> 메서드를 통해 컨텍스트를 생성합니다.

```js
export const ThemeContext = createContext('light')
```

다른 컴포넌트에서 해당 컨텍스트에 접근해야하기 때문에 <span style='color:var(--prism-code-3)'>`export`</span>로 내보내줍니다. 그리고 기본 테마는 화이트모드이기 때문에 컨텍스트의 기본값을 <span style='color:var(--prism-code-3)'>`"light"`</span>로 설정했습니다.

이제 이 컨텍스트를 제공해주는 컴포넌트를 제작하겠습니다.

```js
export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem(THEME.key));

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "dark") {
      localStorage.setItem(THEME.key, THEME.darkMode);
      document.documentElement.classList.add(THEME.darkMode);
    } else {
      localStorage.setItem(THEME.key, THEME.lightMode);
      document.documentElement.classList.remove(THEME.darkMode);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
```

<span style='color:var(--prism-code-3)'>`useState`</span>훅을 통해 로컬스토리지에 있는 테마 값을 상태로 정합니다.
이 상태가 <span style='color:var(--prism-code-3)'>`"dark"`</span>라면 로컬스토리지의 테마 값을 다크모드로 변경하고, <span style='color:var(--prism-code-3)'>`<html>`</span> 태그에 클래스를 추가하여 다크모드로 전환합니다.

이 <span style='color:var(--prism-code-3)'>`theme`</span>과 값을 변경시킬 수 있는 <span style='color:var(--prism-code-3)'>`toggleTheme`</span> 함수를 다른 컴포넌트가 사용할 수 있도록 <span style='color:var(--prism-code-3)'>`<ThemeContext.Provider>`</span>의 <span style='color:var(--prism-code-3)'>`value`</span> 속성의 값으로 전달합니다.

```
참고로 React 19 버전부터는 <SomeContext value={}> 형태로 컨텍스트를 전달한다고 합니다.
해당 프로젝트는 React 18버전으로 진행되어 기존의 방식대로 사용했습니다.
```

<br>

## 2️⃣ Context 사용하기

위에서 만든 Context를 필요한 컴포넌트에서 사용해보겠습니다.
<span style='color:var(--prism-code-3)'>`useContext`</span> 훅을 통해 내보낸 Context를 사용할 수 있습니다.

먼저 헤더에 위치하고 있는 다크모드 토글 버튼의 로직을 수정하겠습니다.

```js
const DarkModeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <Button
      btnStyle="secondary"
      onClick={toggleTheme}
      aria-label="다크모드 토글 버튼"
      btnSize="btn-icon-40"
      className={cn('rounded-md')}
    >
      <Icon iconName={theme === 'light' ? 'darkMode' : 'lightMode'} className="bg-purple-700" />
    </Button>
  )
}
```

원래는 App 컴포넌트에서 직접 테마를 변경했기 때문에 버튼에 로직이 들어가지 않았습니다.
하지만 Context를 사용하면서 기존 APP 컴포넌트에 있던 로직을 전부 지우고 버튼에 역할을 부여하는 방식으로 변경할 수 있었습니다.

다음은 이모지 라이브러리에서 사용해보겠습니다.

```js
const { theme } = useContext(ThemeContext)

const DropdownAddEmoji = () => {
  ;<EmojiPicker
    className="drop-shadow-dropdownBorder z-50"
    open={isOpen}
    width={307}
    height={393}
    onEmojiClick={onClickAddEmoji}
    reactionsDefaultOpen={true}
    theme={theme}
  />
}
```

Emoji-Picker-React 라이브러리는 theme props로 "light", "dark" 문자열을 전달하여 이 라이브러리의 테마를 변경할 수 있습니다.

<span style='color:var(--prism-code-1)'>_테마 변경된 모습_</span>

![emoji-picker](https://velog.velcdn.com/images/nudge0613/post/178b9166-b925-40e2-9171-10aa7881f68d/image.png)

---

프로젝트가 진행 중일 때 이런 방식을 선택했다면 어땠을까라는 생각이 듭니다.  
React Context가 사용하기 어려운 느낌이 좀 있었는데 생각보다 쉽게 만들 수 있었습니다.

> 참고
> [useContext - React 공식문서](https://ko.react.dev/reference/react/useContext)
