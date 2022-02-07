import SystemPower from '@/utils/system'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import './index.less'
import Popover from './popover'
import PopoverItem from './popoverItem'

// interface TaroPopoverComponentProps {
//   list: any[],
//   onTabItem: any,
//   children: any,
//   style?: string,
//   label: string
//   fixOptions: {py: 50}
// }

// props:TaroPopoverComponentProps
export default function TaroPopover(props) {
  const refPopover = useRef()
  const [showMask, setShowMask] = useState(false)
  const [state, setState] = useState({
    // 当前显隐状态
    visible: false,
    // popover 宽
    pw: 110,
    // popover 高
    ph: 120,
    // popover 距左距离
    px: 0,
    // popover 距上距离
    py: 0,
    // 垂直方向 top/bottom
    vertical: '',
    // 水平方向 left/center/right
    align: '',
    // 子元素高度
    itemHeight: 50
  })
  const { list = [], onTabItem, label = 'label' } = props

  const handleClick = () => {
    Taro.createSelectorQuery()
      .select('.button_popver')
      .boundingClientRect((res) => {
        // const currentComp = res.filter(
        //   ({ id }) => id === refPopover.current.uid
        // )[0]
        // 调用自定义组件 popover 中的 onDisplay 方法
        setShowMask(true)
        onDisplay(res)
      })
      .exec()
  }

  const onHide = useCallback(() => {
    setState({ ...state, visible: false })
  }, [state])

  const clickMask = useCallback(
    (e) => {
      e.stopPropagation()
      onHide()
      setShowMask(false)
      refPopover.lastId = ''
    },
    [onHide]
  )

  const onClickItem = useCallback(
    (item, e) => {
      if (onTabItem) onTabItem(item)
      clickMask(e)
    },
    [onTabItem, clickMask]
  )

  const onDisplay = (e) => {
    const { lastId = '', current } = refPopover
    const {
      info: { windowHeight, windowWidth }
    } = SystemPower.get()
    const trangleHeight = 0
    if (!current) return
    if (lastId && lastId === current.uid) {
      setState(() => {
        refPopover.lastId = ''
        return { ...state, visible: false }
      })
    } else {
      Taro.createSelectorQuery()
        .selectViewport()
        .scrollOffset((_view) => {
          let { pw, ph, px, py, vertical, align } = state
          const { scrollTop = 0 } = _view || {}
          let pOverW = (pw - e.width) / 2

          let offsetL = e.left,
            offsetR = windowWidth - e.right,
            offsetB = windowHeight - e.bottom

          if (offsetL >= pOverW && offsetR >= pOverW) {
            align = 'center'
            px = e.left - pOverW
          } else if (offsetL > pOverW && offsetR < pOverW) {
            align = 'left'
            px = windowWidth - (offsetR + pw)
            // 如果向右贴边了，设置一点距离
            if (windowWidth - pw == px) px -= 5
          } else if (offsetL < pOverW && offsetR > pOverW) {
            align = 'right'
            px = e.left
            // 如果向左贴边了，设置一点距离
            if (px == 0) px += 5
          }
          if (offsetB >= ph + trangleHeight) {
            vertical = 'bottom'
            py = scrollTop + e.bottom + trangleHeight
          } else {
            vertical = 'top'
            py = scrollTop + e.top - ph - trangleHeight
          }

          setState({
            ...state,
            visible: true,
            px: px,
            py: props.fixOptions.py || py,
            ph: getItemsHeight(),
            vertical: vertical,
            align: align
          })
        })
        .exec()
      // 记录上一次点击的元素
      refPopover.lastId = current.uid
    }
  }

  // 获取所有子元素的总高度
  const getItemsHeight = () => {
    return state.itemHeight * list.length
  }

  const maskStyle = useMemo(() => {
    const {
      info: { windowHeight, windowWidth }
    } = SystemPower.get()
    return {
      position: 'fixed',
      height: windowHeight + 'px',
      width: windowWidth + 'px',
      background: 'transparent',
      zIndex: 1000
    }
  }, [])

  return (
    <View onClick={handleClick}>
      <View ref={refPopover} className='button_popver' style={props.style}>
        {props.children}
      </View>
      {showMask && (
        <View
          className='mask__container'
          style={maskStyle}
          onClick={clickMask}
        ></View>
      )}
      <Popover state={state}>
        {list &&
          list.map((item) => {
            return (
              <View key={item.value} onClick={(e) => onClickItem(item, e)}>
                <PopoverItem
                  hasline
                  className='popover-item'
                  class='popover-item'
                  height={state.itemHeight}
                >
                  {item[label]}
                </PopoverItem>
              </View>
            )
          })}
      </Popover>
    </View>
  )
}
