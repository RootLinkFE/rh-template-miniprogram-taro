import Taro from '@tarojs/taro'
import React from 'react'
import { Provider } from 'react-redux'
import './app.less'
import Config from './config/index'
import models from './models'
import { isWeapp } from './utils'
import dva from './utils/dva'

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

// do initial
Config.start && Config.start({}, dvaApp)

export default class App extends React.Component {
  constructor() {
    super({}, {})
  }

  componentDidMount() {
    if (isWeapp()) {
      this.updateWeapp()
    }
  }

  updateWeapp() {
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate(() => {
        console.log('checking app update .......')
      })
      updateManager.onUpdateReady(() => {
        // noinspection JSIgnoredPromiseFromCall
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // noinspection JSIgnoredPromiseFromCall
        Taro.showModal({
          title: '更新提示',
          content: '新版本下载失败，请检查你的微信',
          showCancel: false
        })
      })
    } else {
      // noinspection JSIgnoredPromiseFromCall
      Taro.showModal({
        title: '微信升级',
        content: '当前微信版本过低，部分功能无法使用，请升级到最新版本',
        showCancel: false
      })
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
