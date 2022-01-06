import Taro from '@tarojs/taro'
import { wxCheckSession, handleRemoteLogin, handleLogout } from './handler'

export default {
  namespace: 'loginModel',
  state: {
    callbackUrl: '',
    code: ''
  },
  reducers: {
    setCode(state, { code }) {
      console.log(code, 'reducer')
      return { ...state, code }
    }
  },
  effects: {
    /**
     * type DoLoginProps = {
     *   loginMethod: 'wechat_work_app' | 'wechat_app' | 'mobile_vcode' | 'wechat_mobile' | 'account_password';
     * }
     */
    *login({ payload }, { put, select }) {
      const { loginMethod, callback } = payload || {}
      let code = yield select((state) => state.loginModel.code)
      yield handleLogout(false)
      // 微信登录
      if (loginMethod === 'wechat_app') {
        code = yield wxCheckSession()
        yield put({ type: 'setCode', code })
        code && callback?.(code)
      }
      // 微信手机号登录，必须先login后再使用获取手机号按钮获取向量
      // https://developers.weixin.qq.com/community/develop/doc/0008044f8244a805d3766d1465b800
      if (loginMethod === 'wechat_mobile') {
        if (!code) throw '请使用wx.login获取code值'
        code && callback?.(code)
        console.log('登录。。。非微信登录')
        console.log({ ...payload, code }, '{ ...payload, code }')
        handleRemoteLogin({ ...payload, code })
      }
    },

    *logout({ payload }) {
      const { isJump } = payload || {}
      console.log('logout from app')
      yield handleLogout(isJump)
      return
    }
  },
  subscriptions: {}
}
