import Giscus from '@giscus/react'
import { useEffect, useState } from 'react'

export default function GiscusComment() {
  const [theme, setTheme] = useState<string | null>()

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme')

    setTheme(currentTheme)

    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          setTheme(newTheme)
        }
      })
    })

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      themeObserver.disconnect()
    }
  }, [])

  return (
    <div>
      <Giscus
        repo="huuitae/huuitae.github.io"
        repoId="R_kgDOQGUdEA"
        category="Announcements"
        categoryId="DIC_kwDOQGUdEM4Cw7zj"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme || 'light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  )
}
