import { View } from '@tarojs/components'
import { useCallback, useMemo } from 'react'

export const SelectNode = ({ item, currList, keyCode, onItemClick }) => {
  const handleClick = (e) => {
    e.stopPropagation()
    onItemClick?.(item, -1, item.bx, item.qx)
  }

  const isSelect = useMemo(() => {
    if (!currList) return false
    if (currList.length == 0) {
      return false
    }
    const i =
      currList.findIndex((e) => {
        return item[keyCode] === e[keyCode]
      }) > -1
    return i && !item.qx
  }, [item.qx, currList])

  const Render = () => {
    if (item.qx) {
      return <View className='iconfont icon-xuanzhong icons' />
    } else if (item.bx) {
      return <View className='iconfont icon-banxuanzhongshousuo1-shi icons' />
    } else {
      return <View className='iconfont icon-weixuanzhong icons' />
    }
  }

  return (
    <View className='checkbox' onClick={(e) => handleClick(e, item)}>
      {Render()}
    </View>
  )
}
