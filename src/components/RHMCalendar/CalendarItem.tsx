import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import dayjs from 'dayjs'

const CalendarItem = (props) => {
  const { isMarkDate, date, currentDate } = props

  const isToday = useMemo(
    () => dayjs().format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
    [date]
  )

  const getClassName = useMemo(() => {
    const isCurrentDay = date.isSame(currentDate, 'day')
    return `${dayjs().format('YYYY-MM-DD') === date.format('YYYY-MM-DD') &&
      'cover-item-today'} ${isCurrentDay &&
      'current-day'} cover-item whole-style`
  }, [date, currentDate])

  return (
    <View className='calendar-cover-wrap'>
      <View
        className={getClassName}
        style={{
          background: isMarkDate.wholeColor,
          border: isToday ? '1px solid #d92500' : ''
        }}
      >
        {isMarkDate.customBadgeStyle && (
          <View
            className='calendar-cover-badge'
            style={isMarkDate.customBadgeStyle}
          ></View>
        )}
        {isToday ? (
          <View className='today'>
            <Text className='today-text'>{date.format('DD')}</Text>
            <Text className='today-text'>今日</Text>
          </View>
        ) : (
          date.format('DD')
        )}
      </View>
    </View>
  )
}

CalendarItem.propTypes = {
  isMarkDate: PropTypes.object, // { wholeColor, customBadgeStyle}
  currentDate: PropTypes.string, // 选择的日子
  date: PropTypes.any
}

CalendarItem.defaultProps = {
  isMarkDate: {},
  currentDate: '',
  date: ''
}

export default React.memo(CalendarItem)
