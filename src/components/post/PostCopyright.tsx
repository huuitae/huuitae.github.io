import { author, site } from '@/config.json'
import { getFormattedDateTime } from '@/utils/date'
import { AnimatedSignature } from '../AnimatedSignature'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function getPostUrl(slug: string) {
  return new URL(slug, site.url).href
}

export function PostCopyright({
  title,
  slug,
  lastMod,
}: {
  title: string
  slug: string
  lastMod: Date
}) {
  const [lastModStr, setLastModStr] = useState('')
  const url = getPostUrl(slug)

  function handleCopyUrl() {
    navigator.clipboard.writeText(url)
    toast.success('게시글 링크가 복사되었습니다.')
  }

  useEffect(() => {
    setLastModStr(getFormattedDateTime(lastMod))
  }, [lastMod])

  return (
    <section className="text-xs leading-loose text-secondary">
      <p>게시글 제목：{title}</p>
      <p>작성자：{author.name}</p>
      <p>
        <span>게시글 링크：{url}</span>
        <span role="button" className="cursor-pointer select-none" onClick={handleCopyUrl}>
          &nbsp;[복사]
        </span>
      </p>
      <p>마지막 수정일：{lastModStr}</p>
      <hr className="my-3 border-primary" />
      <div>
        <div className="float-right ml-4 my-2">
          <AnimatedSignature />
        </div>
        <p>
          상업적 복제의 경우, 웹마스터에게 허가를 요청하십시오. 비상업적 복제의 경우, 본 기사의
          출처와 링크를 명시해 주십시오. 본 저작물은 어떤 형태로든, 어떤 매체로든 자유롭게 복제 및
          배포할 수 있으며, 수정 및 제작도 가능합니다. 단, 2차 저작물을 배포할 경우에도 동일한
          라이선스 계약을 적용해야 합니다.
          <br />이 게시글은 다음을 채택합니다.
          <a
            className="hover:underline hover:text-accent underline-offset-2"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>
          의 허가를 받아야 합니다.
        </p>
      </div>
    </section>
  )
}
