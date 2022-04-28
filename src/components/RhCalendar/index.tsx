import doubleArrow from '@/assets/svg/double-arrow.svg'
import CalendarImg from '@/assets/images/calendar@2x.png'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import weekdayjs from 'dayjs/plugin/weekday'
import PropTypes from 'prop-types'
import { ArrowLeft, ArrowRight, CalendarOutlined } from '@taroify/icons'
import CalendarItem from './CalendarItem'
import { useDate } from './useDate'
import './index.less'
import { formatMonthData, formatWeekData, patchMonth, throttle } from './util'

const head = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

dayjs.extend(weekdayjs)

const FlexCalendar = (props) => {
  const touchStartPositionXRef = useRef(0)
  const touchStartPositionYRef = useRef(0)
  const isTouchingRef = useRef(false)

  const currentMonthFirstDay = useRef(null)
  const currenWeekFirstDay = useRef(null)
  const monthDates = useRef([])
  const weekDates = useRef([])

  const [currentInDate, setCurrentInDate] = useState()
  const [calendarWidth, setCalendarWidth] = useState(0)
  const [translateIndex, setTranslateIndex] = useState(0)
  const [touch, setTouch] = useState({ x: 0, y: 0 })
  const [showType, setShowType] = useState(props.showType)
  const calendarHeight = 38.4

  const getDateData = (dayjsDate) => {
    const monthObj = formatMonthData(dayjsDate)
    const weekObj = formatWeekData(dayjsDate)

    currentMonthFirstDay.current = monthObj.currentMonthFirstDay
    monthDates.current = monthObj.monthDates

    currenWeekFirstDay.current = weekObj.currenWeekFirstDay
    weekDates.current = weekObj.weekDates
  }

  useEffect(() => {
    const queryDom = Taro.createSelectorQuery()
    queryDom
      .select('#scrollId')
      .boundingClientRect()
      .selectViewport()
      .scrollOffset()
      .exec((res) => {
        setCalendarWidth(res[1].scrollWidth)
      })
  }, [])

  useEffect(() => {
    const { currentDate } = props
    if (currentDate) {
      const dayjsDate = dayjs(currentDate)
      setCurrentInDate(() => {
        getDateData(dayjsDate)
        return currentDate
      })
    }
  }, [props.currentDate])

  const handleTouchMove = useCallback(
    throttle((e) => {
      e.stopPropagation()
      const { disableWeekView, onTouchMove } = props
      const moveX = e.touches[0].clientX - touchStartPositionXRef.current
      const moveY = e.touches[0].clientY - touchStartPositionYRef.current
      if (Math.abs(moveX) > Math.abs(moveY)) {
        // 左右滑动
        setTouch({ x: moveX / calendarWidth, y: 0 })
      } else if (!disableWeekView) {
        setTouch({ x: 0, y: moveY / calendarHeight })
      }
      onTouchMove?.(e)
    }, 25),
    [props]
  )

  const handleTouchStart = useCallback((e) => {
    e.stopPropagation()
    touchStartPositionXRef.current = e.touches[0].clientX
    touchStartPositionYRef.current = e.touches[0].clientY
    isTouchingRef.current = true
    props.onTouchStart(e)
  }, [])

  const handleViewToggle = (direction) => {
    const newTranslateIndex = direction
      ? translateIndex + 1
      : translateIndex - 1
    if (showType === 'month') {
      // 月视图
      const nextMonthFirstDay = currentMonthFirstDay.current[
        direction ? 'subtract' : 'add'
      ](1, 'month')
      const nextMonthStartDay = nextMonthFirstDay.startOf('week')
      const nextMonthEndDay = nextMonthStartDay.add(41, 'day')

      setTranslateIndex(() => {
        getDateData(nextMonthFirstDay)
        props.onTouchEnd(
          patchMonth(nextMonthFirstDay.year(), nextMonthFirstDay.month()),
          nextMonthStartDay.format('YYYY-MM-DD'),
          nextMonthEndDay.format('YYYY-MM-DD')
        )
        return newTranslateIndex
      })
    } else {
      // 周视图
      const nextWeekFirstDay = currenWeekFirstDay.current[
        direction ? 'subtract' : 'add'
      ](1, 'week')
      /* ---------------- 获取月42天区间，周/月模式一致 start-------------------------------*/
      const nextMonthStartDay = nextWeekFirstDay
        .startOf('month')
        .subtract(10, 'day')
      const nextMonthEndDay = nextWeekFirstDay.startOf('month').add(41, 'day')
      /* ---------------- 获取月42天区间，周/月模式一致 end-------------------------------*/
      // const nextWeekLastDay = nextWeekFirstDay.add(6, 'day')
      setTranslateIndex(() => {
        getDateData(nextWeekFirstDay)
        props.onTouchEnd(
          patchMonth(nextWeekFirstDay.year(), nextWeekFirstDay.month()),
          nextMonthStartDay.format('YYYY-MM-DD'),
          nextMonthEndDay.format('YYYY-MM-DD')
        )
        return newTranslateIndex
      })
    }
  }

  const handleTouchEnd = (e) => {
    e.stopPropagation()
    const { disableWeekView } = props
    isTouchingRef.current = false
    const absTouchX = Math.abs(touch.x)
    const absTouchY = Math.abs(touch.y)
    if (absTouchX > absTouchY && absTouchX > 0.15) {
      const newTranslateIndex =
        touch.x > 0 ? translateIndex + 1 : translateIndex - 1
      handleViewToggle(touch.x > 0, newTranslateIndex)
    }
    setTouch({ x: 0, y: 0 })
  }

  const handleMonthToggle = (type) => {
    const isPrev = type === 'prev'
    handleViewToggle(isPrev)
  }

  const handleDayClick = (info) => {
    props.onDateClick(info)
  }

  const handleBottomOperate = () => {
    if (showType === 'week') {
      setShowType(() => {
        const dataArray = monthDates.current[1]
        props.onToggleShowType({
          showType: 'month',
          startTime: dataArray[0].valueOf(),
          endTime: dataArray[dataArray.length - 1].add(1, 'day').valueOf()
        })
        return 'month'
      })
    } else if (showType === 'month') {
      setShowType(() => {
        const dataArray = weekDates.current[1]
        props.onToggleShowType({
          showType: 'week',
          startTime: dataArray[0].valueOf(),
          endTime: dataArray[dataArray.length - 1].add(1, 'day').valueOf()
        })
        return 'week'
      })
    }
  }

  return (
    <View className='react-h5-calendar'>
      <View className='calendar-operate'>
        <View className='icon left-icon'>
          <ArrowLeft size='16' onClick={() => handleMonthToggle('prev')} />
        </View>
        <View className='calendar-operate-text'>
          <View className='calendar-operate-text-calendar'>
            {/* <CalendarOutlined size='18' /> */}
            <Image src={CalendarImg}></Image>
          </View>
          {(showType === 'month'
            ? currentMonthFirstDay.current
            : currenWeekFirstDay.current
          )?.format('YYYY-MM')}
        </View>
        <View className='icon right-icon'>
          <ArrowRight size='16' onClick={() => handleMonthToggle('next')} />
        </View>
      </View>
      <View className='calendar-head'>
        {head.map((i) => (
          <View className='head-cell' key={i}>
            {i}
          </View>
        ))}
      </View>

      <View
        className={`calendar-body ${showType === 'month' ? '' : 'week-mode'}`}
        id='scrollId'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <View
          style={{
            transform: `translate3d(${-translateIndex * 100}%, 0, 0)`
          }}
        >
          {(showType === 'month' ? monthDates.current : weekDates.current).map(
            (item, index) => {
              return (
                <View
                  className='month-cell'
                  key={`month-cell-${index}`}
                  style={{
                    transform: `translate3d(${(index -
                      1 +
                      translateIndex +
                      (isTouchingRef.current ? touch.x : 0)) *
                      100}%, 0px, 0)`,
                    transitionDuration: `${
                      isTouchingRef.current ? 0 : props.transitionDuration
                    }s`
                  }}
                >
                  {item.map((date, itemIndex) => {
                    const isOtherMonthDay =
                      showType === 'week'
                        ? false
                        : !date.isSame(currentMonthFirstDay.current, 'month')

                    const isMarkDate =
                      props.markDates.find((i) => date.isSame(i.date, 'day')) ||
                      {}
                    return (
                      <View
                        key={date?.format('MM-DD')}
                        className='day-cell'
                        // className={`day-cell ${
                        //   isOtherMonthDay ? 'is-other-month-day' : ''
                        // }`}
                        onClick={() => {
                          handleDayClick({
                            date: date?.format('YYYY-MM-DD'),
                            disabled: isMarkDate.disabled
                          })
                        }}
                      >
                        <View
                          className='day-text'
                          style={
                            isMarkDate.disabled && {
                              color: '#ccc'
                            }
                          }
                        >
                          <CalendarItem
                            isMarkDate={{
                              ...isMarkDate,
                              wholeColor:
                                isMarkDate.wholeColor || props.defaultBgColor
                            }}
                            date={date}
                            currentDate={props.currentDate}
                          ></CalendarItem>
                        </View>
                      </View>
                    )
                  })}
                </View>
              )
            }
          )}
        </View>
      </View>
      {props.footerView && props.footerView()}
      {props.disableWeekView ? null : (
        <View className='bottom-operate' onClick={handleBottomOperate}>
          <Image
            className={showType === 'month' ? 'top' : 'down'}
            src={doubleArrow}
          />
        </View>
      )}
    </View>
  )
}

FlexCalendar.propTypes = {
  currentDate: PropTypes.string,
  showType: PropTypes.oneOf(['week', 'month']),
  transitionDuration: PropTypes.number,
  onDateClick: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onToggleShowType: PropTypes.func,
  markType: PropTypes.oneOf(['dot', 'circle']),
  markDates: PropTypes.array, // [{disabled ,wholeColor}]
  defaultBgColor: PropTypes.string,
  disableWeekView: PropTypes.bool,
  footerView: PropTypes.func,
  isOneColor: PropTypes.bool // 是否只有单色，决定选择日期的样式
}

FlexCalendar.defaultProps = {
  currentDate: dayjs().format('YYYY-MM-DD'),
  showType: 'month',
  transitionDuration: 0.3,
  onDateClick: () => {},
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  onToggleShowType: () => {},
  markType: 'dot',
  markDates: [],
  disableWeekView: false,
  footerView: () => {},
  isOneColor: false
}

export default FlexCalendar
