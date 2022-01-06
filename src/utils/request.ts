import {
  RES_INVALID_PARAMS_CODE,
  RES_NOT_FOUND_CODE,
  RES_PERMISSION_DENIED_CODE,
  RES_SECRET_INCORRECT_CODE,
  RES_SUCCESS_DEFAULT_CODE,
  RES_UNAUTHORIZED_CODE,
  TOKEN_KEY,
  BASE_URL
} from '@/config/const'
import NavigationService from '@/utils/navigation'
import Taro from '@tarojs/taro'
import GlobalToast from './toast'

/* eslint-disable */
const noConsole = process.env.ENV === 'dev'
/* eslint-enable */
const getTokenStorage = () =>
  Taro.getStorageSync(TOKEN_KEY)
    ? `bearer ${Taro.getStorageSync(TOKEN_KEY)}`
    : ''

const ignoreInterceptor = (resp) => {
  try {
    if (
      resp.config?.url?.indexOf('fileUpload') > -1 ||
      resp.config?.url?.indexOf('upload-file') > -1
    ) {
      return true
    }
    if (
      resp.config?.method === 'get' &&
      resp.config?.params &&
      resp.config.params?.ignoreInterceptor
    ) {
      return true
    }
    if (
      resp.config?.method === 'post' &&
      resp.config?.data &&
      JSON.parse(resp.config.data)?.ignoreInterceptor
    ) {
      return true
    }
    return false
  } catch (error) {}
}

export const Request = async (
  options = { method: 'GET', data: {}, uri: '' }
) => {
  GlobalToast.show({ text: '正在加载...', icon: 'loading' })
  if (!true) {
    console.log(
      `${new Date().toLocaleString()}【 M=${options.uri} 】P=${JSON.stringify(
        options.data
      )}`
    )
  }
  const token = Taro.getStorageSync(TOKEN_KEY)
  const Authorization = token ? `bearer ${token}` : ''
  return Taro.request({
    url: BASE_URL + options.uri,
    data: {
      ...options.data
    },
    header: options.header || {
      'Content-Type': 'application/json',
      Authorization
    },
    method: options.method.toUpperCase()
  })
    .then(async (response) => {
      const res = response?.data
      const { code, desc, data } = res || {}
      let tips = ''

      let error = {
        code,
        res,
        text: tips
      }

      if (!code) {
        tips = `响应错误`
        return Promise.reject(error)
      }

      if (code && code !== RES_SUCCESS_DEFAULT_CODE) {
        if ([RES_INVALID_PARAMS_CODE, RES_NOT_FOUND_CODE].includes(code)) {
          tips = `请求错误 ${code}: ${desc}`
          // 4000、3000 接口提示错误
        } else if (code === RES_UNAUTHORIZED_CODE) {
          tips = `登录失效 ${code}: ${desc}`
          NavigationService.dispatch('loginModel/logout', { isJump: false })
        } else if (
          code === RES_PERMISSION_DENIED_CODE ||
          code === RES_SECRET_INCORRECT_CODE
        ) {
          // token 不存在,请重新登录账户
          tips = `登录失效，请重新登录! ,${desc}`
          NavigationService.dispatch('loginModel/logout', { isJump: false })
        } else {
          // 其他 code 可能前端不知道的情况
          tips = `响应错误 ${code}: ${desc}`
        }
        error.text = tips
        return Promise.reject(error)
      }
      try {
        await GlobalToast.hide()
      } catch (err) {}
      return data
    })
    .catch((err) => {
      const text = err.text || '请求失败，请检查网络'
      GlobalToast.show({ text })
      // if (err.request && err.request.status === RES_UNAUTHORIZED_CODE) {
      //   console.log('gotologin')
      //   // gotoLogin()
      // }
      return Promise.reject(err)
    })
}

export const Get = (uri, data, ...params) => {
  return Request({ method: 'GET', data, uri, ...params })
}

export const Post = (uri, data, ...params) => {
  return Request({ method: 'POST', data, uri, ...params })
}
