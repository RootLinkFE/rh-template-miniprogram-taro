import GlobalToast from '@/utils/toast'
import { DropdownMenu, Grid } from '@taroify/core'
import { ArrowLeft, ArrowRight } from '@taroify/icons'
import { View } from '@tarojs/components'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import './index.less'

const MIN_YEAR = 1000
const MAX_YEAR = 9999

function RhmYearSelect(props) {
  const { value, onChange } = props

  const [visible, setVisible] = useState()
  const [year, setYear] = useState(value || dayjs().year())
  const [yearsRange, setYearsRange] = useState([])

  // 获取前后10年区间
  const calcRange = useCallback((v) => {
    if (v < MIN_YEAR || v > MAX_YEAR)
      return GlobalToast.show({ text: '年份区间为1000-9999' })
    let arr = Array.from(new Array(10))
    const yearStr = v.toString()
    const firstYear = `${yearStr.substr(0, yearStr.length - 1)}0`
    arr = arr.map((b, index) => +firstYear + index)
    return setYearsRange(arr)
  }, [])

  const handleRange = (dire) => {
    // 获得区间的某个数
    const tempYear = dire === 'prev' ? yearsRange[0] - 1 : yearsRange[9] + 1
    calcRange(tempYear)
  }

  const handleSelect = useCallback((v) => {
    setYear(v)
    setVisible(false)
    onChange?.(v)
  }, [])

  // const menuClassName = useMemo(() => {})

  // 初始化今年区间
  useEffect(() => {
    calcRange(year)
  }, [])

  return (
    <DropdownMenu value={visible} onChange={setVisible} className='year-select'>
      <DropdownMenu.Item title={year}>
        <View className='header'>
          <View className='icon left-icon'>
            <ArrowLeft size='20' onClick={handleRange.bind(this, 'prev')} />
          </View>
          <View className='header-text'>
            {yearsRange[0]} - {yearsRange[9]}
          </View>
          <View className='icon'>
            <ArrowRight size='20' onClick={handleRange.bind(this, 'next')} />
          </View>
        </View>
        <View className='content'>
          <Grid columns={3} className='content-grid' bordered={false}>
            <Grid.Item className='content-disabled' text={yearsRange[0] - 1} />
            {yearsRange.map((b) => (
              <Grid.Item
                key={b}
                text={b}
                onClick={() => handleSelect(b)}
                className={b === year ? 'selected' : ''}
              ></Grid.Item>
            ))}

            <Grid.Item className='content-disabled' text={yearsRange[9] + 1} />
          </Grid>
        </View>
      </DropdownMenu.Item>
    </DropdownMenu>
  )
}

export default RhmYearSelect
