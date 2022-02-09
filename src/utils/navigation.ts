import { PAGE_LEVEL_LIMIT } from '@/config/const'
import { fromPairs, get, memoize, omit, deepGet } from '@/utils/mylodash'
import Taro, { Current } from '@tarojs/taro'
import { isEmpty, isNotEmpty } from './common'

const NavigationMethodMap = {
  push: 'navigateTo',
  replace: 'redirectTo',
  back: 'navigateBack',
  switchTab: 'switchTab',
  reLaunch: 'reLaunch'
}
export type NavigationMethodType =
  'push' | 'replace' | 'back' | 'reLaunch' | 'switchTab'

/**
 * 将页面和参数转化Taro的本地页面跳转URI
 *
 * @param uri 可能带有协议和？参数
 * @param params
 *
 * @return 带有？参数
 */
function toTaroUrl(uri, params) {
  if (isEmpty(uri)) {
    return ''
  }
  const postFix = Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&')
  const connectChart = uri.includes('?') ? '&' : '?'
  return uri + connectChart + postFix
}

/**
 * 将uri转换为taro页面和参数
 * @param uri string
 * @return pathname: page在config中的名字，以/开头
 *         params: 参数map
 */
const parseUri = (uri) => {
  const urlData = uri.split('?')
  let params = {}
  if (isNotEmpty(urlData)) {
    const strAry = urlData[1].split('&').map((i) => i.split('='))
    params = fromPairs(strAry)
  }
  const page = urlData[0]
  const pagePath = !page.startsWith('/') ? `/${page}` : page
  return { pagePath, params }
}

const isFooterTabPage = memoize((pagePath = '') => {
  if (isEmpty(pagePath)) {
    return false
  }
  // @ts-ignore
  const taroAppConfig = window?.__taroAppConfig
  const list = taroAppConfig?.tabBar?.list || []
  return list.some((it) => pagePath?.startsWith(it.pagePath))
})

/**
 * 转换 method 到Taro的方法
 * @param method Taro.XXX方法，默认是navigateTo
 *  @param pagePath 页面名称，config中配置的
 */
const _getNavigationMethod = (method, pagePath) => {
  if (isFooterTabPage(pagePath)) {
    return Taro.switchTab
  }
  const theName = NavigationMethodMap[method] || 'navigateTo'

  let theFunction = Taro[theName] || Taro.navigateTo
  if (
    theFunction === Taro.navigateTo &&
    Taro.getCurrentPages().length === PAGE_LEVEL_LIMIT
  ) {
    console.warn(
      'currentPages method is navigateTo，but the page stack is full, change it to redirect'
    )
    return Taro.redirectTo
  }
  return theFunction
}

class NavigationServiceClass {
  _container = {}
  pageHistory = {} // 记得清空这个玩意，小心内存泄露

  get container() {
    return this._container || {}
  }

  set container(container) {
    if (!container) {
      return
    }
    this._container = container
    this.clearHistory()
  }

  clearHistory() {
    this.pageHistory = {}
  }

  isOnePage() {
    return Taro.getCurrentPages().length < 2
  }

  dispatch(actionType, params = {}) {
    const { dispatch = () => {} } = this.container || {}
    dispatch({ type: actionType, payload: params })
  }
  /**
   *
   *回退信息，
   *
   * @param data 后退时候，回传的数据对象
   * @param delta 后退步数，默认为1
   */
  back(data = {}, delta = 1) {
    if (Taro.getCurrentPages().length === 1) {
      console.log('页面栈只剩一个了，不能后退')
      return
    }
    const key = Current?.router?.path || ''
    return new Promise((resolve, reject) => {
      Taro.navigateBack({ delta })
        .then(() => {
          const { callback } = this.pageHistory[key] || {}
          if (callback) {
            callback(data)
            omit(this.pageHistory, key)
          }
          resolve(null)
        })
        .catch((err) => reject(err))
    })
  }

  /**
   *
   * @param routeName 跳转url
   * @param params url参数
   * @param options NavigationMethodMap
   * @returns {Promise<any>}
   */
  navigate(routeName, params, options) {
    return new Promise((resolve, reject) => {
      if (isEmpty(routeName)) {
        resolve && resolve(null)
        return
      }
      const url = toTaroUrl(routeName, params)
      const { pagePath } = parseUri(url)
      const navigationMethod = _getNavigationMethod(
        options?.navigationMethod || 'push',
        pagePath
      )
      navigationMethod({ url })
        .then(() => {
          // 把resolve存起来，主动调用 back的时候再调用
          const resolveShouldCallWhenPageGoBack = deepGet(
            options,
            'delayCallBack',
            false
          )
          const resolveCallback = deepGet(options, 'callBack', false)
          if (!resolveShouldCallWhenPageGoBack) {
            resolve && resolve(null)
            return
          }
          //call back delay
          this.pageHistory[pagePath] = {
            pagePath,
            callback: resolve
          }
        })
        .catch((err) => {
          const { errMsg = '' } = err
          if (errMsg.indexOf('a tabbar page')) {
            Taro.switchTab({ url }).then(() => {
              if (resolve) {
                resolve(null)
              }
            })
            return
          }
          console.log(`Taro navigation get failed`, err)
          reject(err)
        })
    })
  }

  push(routeName, params = {}, options = {}) {
    return this.navigate(routeName, params, {
      navigationMethod: 'push',
      ...options
    })
  }
  replace(routeName, params = {}, options = {}) {
    return this.navigate(routeName, params, {
      navigationMethod: 'replace',
      ...options
    })
  }
}

const NavigationService = new NavigationServiceClass()
export default NavigationService
