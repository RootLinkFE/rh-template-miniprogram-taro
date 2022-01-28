import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'
import NavigationService from '@/utils/navigation'
// import {getDotList, listenDotListChange} from './extra/redDot'
import { getActive, setActive, listenActiveChange } from './extra/customActive'
import './index.less'

type PropType = {
  activeIdx: any
  config: any
  list: any
  customOrder: any
  customActive: any
  customTransitionTime: any
}

const fixListConfig = function(item, index) {
  const result = {
    pagePath: '',
    iconPath: '',
    selectedIconPath: '',
    idx: '',
    redDot: false,
    text: ''
  } // 使用新对象，类似浅拷贝
  result.pagePath = '/' + item.pagePath.replace(/.html$/g, '')
  result.iconPath = item.iconData
    ? 'data:image/png;base64,' + item.iconData
    : '/' + item.iconPath.replace(/\\/g, '/')
  result.selectedIconPath = item.selectedIconData
    ? 'data:image/png;base64,' + item.selectedIconData
    : '/' + item.selectedIconPath.replace(/\\/g, '/')
  result.idx = index
  result.redDot = false
  result.text = item.text
  return result
}

class RHMTabbar extends React.Component<any, PropType> {
  static _tabBar: any = Taro.getCurrentInstance()

  constructor(props) {
    console.log(Taro.getCurrentInstance(), 'Taro.getCurrentInstance()')
    super(props)
    this.state = {
      activeIdx: -1,
      config: RHMTabbar._tabBar,
      list: RHMTabbar._tabBar.app.config.tabBar.list.map(fixListConfig) || [],
      // 自定义节点
      customOrder: Math.floor(RHMTabbar._tabBar.app.config.tabBar.list.length / 2) - 1,
      customActive: false,
      customTransitionTime: '0.3s'
    }
  }

  componentDidMount() {
    console.log(RHMTabbar._tabBar.app.config.tabBar)
  }

  switchTab(evt) {
    const { pagePath } = evt.currentTarget.dataset
    NavigationService.navigate(
      pagePath,
      {},
      {
        navigationMethod: 'switchTab'
      }
    )
  }

  // updateRedDot() {
  //   if (Array.isArray(getDotList())) {
  //     this.setState({
  //       list: this.state?.list.map((item) => {
  //         item.redDot = getDotList()[item.idx]
  //         return item
  //       })
  //     })
  //   }
  // }

  updateCustomNodeActive(status) {
    this.setState({
      customActive: status
    })
  }

  handleCustomNodeTap() {
    setActive(!this.state.customActive)
  }

  render() {
    const { config, list, activeIdx, customOrder } = this.state
    return (
      <View
        className='tab-bar'
        style={{ backgroundColor: config.backgroundColor }}
      >
        <View
          className={`tab-bar-border ${config.borderStyle}`}
          // style={{ borderTopColor: borderColor }}
        ></View>
        <View className='tab-bar-list'>
          {list?.map((item) => (
            <View
              key={item.pagePath}
              className='tab-bar-item'
              style={{
                color:
                  item.idx === activeIdx ? config.selectedColor : config.color,
                order: item.idx
              }}
              data-page-path={item.pagePath}
              onClick={this.switchTab}
            >
              <View className='tab-bar-item-icon'>
                <Image
                  src={
                    item.idx === activeIdx
                      ? item.selectedIconPath
                      : item.iconPath
                  }
                />
                {item.redDot && <View className='red-dot'></View>}
              </View>
              <View className='tab-bar-item-text'>{item.text}</View>
            </View>
          ))}
          {config.customNode && list.length <= 4 && (
            <View
              className='tab-bar-item custom'
              style={{ order: customOrder }}
              onClick={this.handleCustomNodeTap}
            >
              <View className='tab-bar-item-icon'>
                {/* <Image style={{`${customActive ? config.customNode.activeStyle : config.customNode.style} transition: ${customTransitionTime}`}} src={config.customNode.iconPath} /> */}
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}

export default RHMTabbar
