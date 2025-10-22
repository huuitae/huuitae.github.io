import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { getDaysInYear, getDiffInDays, getStartOfDay, getStartOfYear } from '@/utils/date'

export function TimelineProgress() {
  const [currentYear, setCurrentYear] = useState(0)
  const [dayOfYear, setDayOfYear] = useState(0)
  const [percentOfYear, setPercentOfYear] = useState(0)
  const [percentOfToday, setPercentOfToday] = useState(0)
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()

  const updateInfo = () => {
    setCurrentYear(now.getFullYear())

    const pastDays = getDiffInDays(getStartOfYear(now), now)
    setDayOfYear(pastDays)
    setPercentOfYear((pastDays / getDaysInYear(now)) * 100)

    const pastTime = now.getTime() - getStartOfDay(now).getTime()
    setPercentOfToday((pastTime / 86400 / 1000) * 100)
  }

  useEffect(() => {
    updateInfo()
    const interval = setInterval(updateInfo, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <p className="mt-4">
        <span className="font-bold">{currentYear}</span>년의{' '}
        <span className="font-bold">
          <CountUp to={dayOfYear} decimals={0} />
        </span>
        일째 -{' '}
        <span className="font-bold">
          <CountUp to={percentOfYear} decimals={1} />
        </span>
        %
      </p>
      {/* <p className="mt-2">
        올해의{' '}
        <span className="font-bold">
          <CountUp to={percentOfYear} decimals={1} />
        </span>
        %가 지나갔습니다.
      </p> */}
      <p className="mt-2">
        <span className="font-bold">
          {month}월 {day}일
        </span>
        의{' '}
        <span className="font-bold">
          <CountUp to={percentOfToday} decimals={1} />
        </span>
        %가 지나갔습니다.
      </p>
    </>
  )
}

function CountUp({
  to,
  decimals,
  duration = 1,
}: {
  to: number
  decimals: number
  duration?: number
}) {
  const node = useRef<HTMLSpanElement>(null)
  const prev = useRef(0)

  useEffect(() => {
    if (!node.current) return

    const control = animate(prev.current, to, {
      duration,
      onUpdate: (value) => {
        node.current!.textContent = value.toFixed(decimals)
      },
    })
    prev.current = to

    return () => {
      control.stop()
    }
  }, [to, decimals, duration])

  return <span ref={node}></span>
}
