import React from 'react'
import { Provider } from 'react-redux'
import './app.less'
import Config from './config/index'
import models from './models'
import { isWeapp } from './utils'
import dva from './utils/dva'
import SystemPower from './utils/system'
import Taro from '@tarojs/taro'

declare const NEED_CUSTOM_TABBAR: boolean

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

// do initial
Config.start && Config.start({}, dvaApp)

export default class App extends React.Component {
  customNode: {
    iconName: string // 需要根据export的名字动态引入图片，import * as ImageService from '@/services/dynamicImage'
    pagePath: string
    needTabBar?: boolean // pagePath页面是否需要tabbar
    pagePathParams?: Record<string, any>
    activeStyle?: Partial<CSSStyleDeclaration>
    style?: Partial<CSSStyleDeclaration>
  }

  constructor() {
    super({}, {})
    if (NEED_CUSTOM_TABBAR) {
      Taro.hideTabBar()
      this.customNode = {
        pagePath: '/pagesA/login/index',
        iconName: 'create',
        style: {
          width: '100rpx',
          height: '66rpx',
          top: '50%',
          left: '50%',
          marginLeft: '-50rpx',
          marginTop: '-18rpx'
        }
      }
    }
  }

  componentDidMount() {
    if (isWeapp()) {
      SystemPower.update()
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}
