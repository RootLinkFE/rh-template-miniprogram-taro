import React from 'react'
import { Provider } from 'mobx-react'
import './app.less'
import store from './store'
import { isWeapp } from './utils'
import SystemPower from './utils/system'
import Taro from '@tarojs/taro'
import { PageProps } from '../global'

declare const NEED_CUSTOM_TABBAR: boolean

export default class App extends React.Component<PageProps> {
  customNode: {
    iconName: string // 需要根据export的名字动态引入图片，import * as ImageService from '@/services/dynamicImage'
    pagePath: string
    needTabBar?: boolean // pagePath页面是否需要tabbar
    pagePathParams?: Record<string, any>
    activeStyle?: Partial<CSSStyleDeclaration>
    style?: Partial<CSSStyleDeclaration>
  }

  constructor(props) {
    super(props)
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
          marginTop: '-18rpx',
        },
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
