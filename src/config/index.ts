import NavigationService from '@/utils/navigation'
import { get, merge } from '@/utils/mylodash'

// 输出日志信息
export const noConsole = false

export const defaultConfig = {
  name: 'Taro小程序',
  version: 1,
  viewConfig: {},
  loginMode: 'wechat', // 'wechat' | 'vcode' | 'password'; 对应不同登录方式
  api: {},
  backendRouterPageBlackList: [],
  backendRouterPageKeyBlackList: [],
  get: (key) => get(this, key),
  start: (...args) => {}
}

/* eslint-disable */
let Config = defaultConfig

Config.start = (config, container) => {
  NavigationService.container = container
  Config = merge(defaultConfig, config)
}

export default Config
