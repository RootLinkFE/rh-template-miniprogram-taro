import { useEffect, useRef } from 'react'
import { formatMonthData, formatWeekData } from './util'

export function useDate(dayjsDate) {
  const currentMonthFirstDay = useRef()
  const currenWeekFirstDay = useRef()
  const monthDates = useRef([])
  const weekDates = useRef([])
  console.log(dayjsDate, 123)

  useEffect(() => {
    const [a, b] = formatMonthData(dayjsDate)
    currentMonthFirstDay.current = a
    monthDates.current = b
    const [c, d] = formatWeekData(dayjsDate)
    currenWeekFirstDay.current = c
    weekDates.current = d
    console.log(a, b, c, d, 12)
  }, [dayjsDate])

  return [
    currentMonthFirstDay.current,
    monthDates.current, // 月日历需要展示的日期 包括前一月 当月 下一月
    currenWeekFirstDay.current,
    weekDates.current // 周日历需要展示的日期  包括前一周 当周 下一周
  ]
}
