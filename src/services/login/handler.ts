import Taro from '@tarojs/taro'
import * as LoginAPI from '@/api/login'
// import * as MasterAPI from '@/api/master'
import { TOKEN_KEY, USERINFO_KEY } from '@/config/const'
import { promiseHandle, sleep } from '@/utils/common'
import NavigationService from '@/utils/navigation'
import GlobalToast from '@/utils/toast'

const wxObj = Taro

// 微信登录
export function wxLogin() {
  return new Promise((resolve, reject) => {
    wxObj.login({
      success: async (res) => {
        const { code } = res
        console.log('进行wxlogin, code is', code)
        // handleRemoteLogin({ ...payload, code: code })
        return resolve(code)
      },
      fail: (res) => {
        GlobalToast.show({ text: res || `微信登录失败，请检查网络` })
        return reject()
      }
    })
  })
}

export function wxCheckSession() {
  return new Promise((resolve, reject) => {
    wxObj.checkSession({
      success: async () => {
        const isLoginToken = Taro.getStorageSync(TOKEN_KEY)
        console.log('checkSession')
        if (!isLoginToken) {
          wxLogin().then((code) => {
            return resolve(code)
          })
        }
      },
      fail: () => {
        console.log('token失效，重新登录')
        wxLogin().then((code) => {
          resolve(code)
        })
      }
    })
  })
}

export async function handleRemoteLogin(payload) {
  // 预留options字段用作静默登录、匿名登录等其他扩展
  const { options = {}, ...params } = payload

  const [loginErr, loginRes] = await promiseHandle(LoginAPI.login(params))
  if (loginErr) {
    NavigationService.dispatch('loginModel/login', {
      loginMethod: 'wechat_app'
    })
    return
  }
  GlobalToast.show({ text: `登录成功！`, icon: 'success' })
  await sleep(1000)
  const { access_token: token } = loginRes
  try {
    if (token) {
      Taro.setStorageSync(TOKEN_KEY, token)
      // const [userErr, userRes] = await promiseHandle(MasterAPI.userInfo())
      // if (userErr) return
      // const { phone, name } = userRes
      // Taro.setStorageSync(USERINFO_KEY, {
      //   phone,
      //   name
      // })
      // NavigationService.dispatch('commonModel/save')
    }
  } catch (error) {
  } finally {
    setTimeout(() => {
      if (NavigationService.isOnePage()) {
        NavigationService.push('/')
      } else {
        NavigationService.replace('/pages/mine/index')
      }
    }, 500)
  }
}

export function handleLogout(isJump = true) {
  // Taro.removeStorageSync(TOKEN_KEY)
  // Taro.removeStorageSync(USERINFO_KEY)
  Taro.clearStorage()
  NavigationService.dispatch('commonModel/clean')
  if (isJump) {
    NavigationService.push('/pagesA/login/index')
  }
}
