import NavigationService from '@/utils/navigation'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState, useEffect, useMemo } from 'react'
import { ArrowLeft } from '@taroify/icons'
import './index.less'
import SystemPower from '@/utils/system'

function RHMHeadNav(props) {
  /**
   * needBackIcon 是否需要返回键
   * mainTitle 标题
   * needSpace 是否独占顶部
   * to 跳转地址
   * lightTheme 亮主题
   */
  const {
    needBackIcon = true,
    mainTitle = '',
    needSpace = false,
    to,
    lightTheme = false
  } = props
  const [navBarHeight, setNavBarHeight] = useState()

  const getNavHeight = async () => {
    let menuButtonObject = Taro.getMenuButtonBoundingClientRect()
    const sysInfo = SystemPower.get()
    let statusBarHeight = sysInfo.statusBarHeight
    let menuBottonHeight = menuButtonObject.height
    let menuBottonTop = menuButtonObject.top
    let barHeight =
      statusBarHeight + menuBottonHeight + (menuBottonTop - statusBarHeight) * 2
    setNavBarHeight(barHeight)
  }

  const goBackPage = () => {
    if (to) {
      return NavigationService.replace(to)
    }
    return NavigationService.back()
  }

  const getStyle = useMemo(
    () => ({
      position: needSpace ? 'absolute' : 'relative',
      height: `${navBarHeight}px`
    }),
    [needSpace, navBarHeight]
  )

  useEffect(() => {
    getNavHeight()
  }, [])

  return (
    <View className='nav_custom_bar' style={getStyle}>
      <ArrowLeft
        className={`nav_custom_bar_back ${needBackIcon ? '' : 'hidden'}`}
        size='20'
        color={lightTheme ? '#fff' : '#000'}
        onClick={goBackPage}
      />
      <Text
        className='nav_custom_bar_title'
        style={{ color: lightTheme ? '#fff' : '#000' }}
      >
        {mainTitle}
      </Text>
      <View></View>
    </View>
  )
}

export default React.memo(RHMHeadNav)
