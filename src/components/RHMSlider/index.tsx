import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { monthItems } from './constants'
import './index.less'

function RHMSlider(props) {
  const {
    wrapStyle = {},
    wrapLeft,
    type = 'month',
    defaultItems,
    value,
    onChange
  } = props

  const visibleRef = useRef('hidden')
  const [contentWidth, setContentWidth] = useState(0)
  const items = useMemo(
    () => (type === 'month' ? monthItems : defaultItems),
    []
  )

  useEffect(() => {
    const calcItemWidth = () => {
      const { windowWidth } = Taro.getSystemInfoSync()
      const queryDom = Taro.createSelectorQuery()
      queryDom
        .selectAll('.slider-item')
        .boundingClientRect((res) => {
          if (!res[0]?.width) {
            setTimeout(() => {
              calcItemWidth()
            }, 200)
          } else {
            let width = 0
            res?.map((b) => {
              width += b.width
            })
            // setContentWidth(width * 1.81 - wrapLeft / 2)
            visibleRef.current = 'initial'
            setContentWidth((width * 750) / windowWidth - wrapLeft / 2)
          }
        })
        .exec()
    }
    calcItemWidth()
  }, [])

  const handleClick = (v) => {
    onChange?.(v)
  }

  return (
    <ScrollView
      className='slider-wrap'
      style={{
        width: `calc(100% - ${wrapLeft}rpx)`,
        ...wrapStyle,
        visibility: visibleRef.current,
      }}
      scrollX={true}
      scrollWithAnimation={true}
    >
      <View
        className='slider-content'
        style={{
          width: contentWidth
        }}
      >
        {items.map((item) => (
          <View
            className={`slider-item ${item.value === value ? 'selected' : ''}`}
            key={item.value}
            onClick={() => handleClick(item.value)}
          >
            {item.label}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default RHMSlider
